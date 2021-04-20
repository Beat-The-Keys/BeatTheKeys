"""This is the main app that serves as a server for all the clients"""
import os
from collections import OrderedDict
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='../build/static')

APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)

# import models  # pylint: disable=wrong-import-position
# DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)
SESSIONS = {}
'''
SESSIONS contains a dictionary of session ids which map to corresponding player names.
'''

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''When someone connects to the server'''
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''When a player disconnects from the server, we get their name
    from their session id and remove them from the lobby'''
    if request.sid in SESSIONS:
        disconnected_player = SESSIONS[request.sid]
        for room in ROOMS:
            if disconnected_player in ROOMS[room]['activePlayers']:
                remove_player_from_lobby({'playerName':disconnected_player, 'room':room})
                print(disconnected_player + ' disconnected!')

ROOMS = {}
'''
ROOMS contains a dictionary of room ids, which maps to a dictionary
that contains the active and finished players in that room.

Ex: ROOMS[1234] = {
        'activePlayers': {
            'John': 97
            'Matt': 84
        },
        'finishedPlayers': ['John']
    }
}
'''
@SOCKETIO.on('assignPlayerToLobby')
def assign_player_to_lobby(data):
    '''Put the user in a specified room'''
    player_name = data['playerName']
    room = data['room']
    # If this function is called with an empty room ID, user is joining for the first time.
    # In the future, we will generate an ID for them.
    # For now, all players join the "Multiplayer" room.
    if room == "":
        room = "Multiplayer"
    # Join the specified room
    join_room(room)
    # If the 'room' is not in ROOMS then add it
    if room not in ROOMS:
        ROOMS[room] = {}
        ROOMS[room]['activePlayers'] = OrderedDict()
        ROOMS[room]['playersFinished'] = []
    # If the player is not in the room then add them
    if player_name not in ROOMS[room]:
        ROOMS[room]['activePlayers'][player_name] = 0
        SESSIONS[request.sid] = player_name
    active_players = list(ROOMS[room]['activePlayers'].keys())
    SOCKETIO.emit('assignPlayerToLobby', {'activePlayers': active_players, 'room': room}, room=room)

@SOCKETIO.on('updatePlayerStats')
def update_player_stats(data):
    '''Clients send their WPM and the server sends updated stats to all clients in the room'''
    room = data['room']
    player_name = data['playerName']
    wpm = data['wpm']
    ROOMS[room]['activePlayers'][player_name] = wpm
    SOCKETIO.emit(
        'updatePlayerStats', {'playerStats': ROOMS[room]['activePlayers']},
        broadcast=True,
        room=room
    )
    return ROOMS[room]['activePlayers']

@SOCKETIO.on('removePlayerFromLobby')
def remove_player_from_lobby(data):
    '''User leaves the room'''
    room = data['room']
    player_name = data['playerName']
    # Remove the player from the room
    ROOMS[room]['activePlayers'].pop(player_name, None)
    if player_name in ROOMS[room]['playersFinished']:
        ROOMS[room]['playersFinished'].remove(player_name)
    SOCKETIO.emit(
        'updatePlayerStats', {'playerStats': ROOMS[room]['activePlayers']},
        broadcast=True,
        room=room
    )
    active_players = list(ROOMS[room]['activePlayers'].keys())
    # assignPlayerToLobby is used to refresh the lobby for all players.
    # We can change up the name later to avoid confusion.
    SOCKETIO.emit(
        'assignPlayerToLobby', {'activePlayers': active_players, 'room': room},
        broadcast=True,
        room=room
    )
    leave_room(room)

@SOCKETIO.on('startGame')
def start_game(data):
    '''Starts the game for all players in a lobby'''
    SOCKETIO.emit('startGame', broadcast=True, include_self=False, room=data['room'])

@SOCKETIO.on('playerFinished')
def player_finished(data):
    '''
    A client sends a message when they finished the game
    Eventually we should check if the user achieved their best WPM here and store it in our db.

    '''
    room = data['room']
    player_name = data['playerName']
    ROOMS[room]['playersFinished'].append(player_name)
    SOCKETIO.emit(
        'playersFinished', {'playersFinished': ROOMS[room]['playersFinished']},
        broadcast=True,
        room=room
    )
    # If all the players in the room are finished, send a 'gameComplete' message to every client
    # Comparing lists will also check item order by default, so instead we can use sets.
    active_players_set = set(ROOMS[room]['activePlayers'].keys())
    players_finished_set = set(ROOMS[room]['playersFinished'])
    if players_finished_set == active_players_set:
        SOCKETIO.emit('gameComplete', broadcast=True, room=room)

    return ROOMS[room]['playersFinished']

@SOCKETIO.on('goBackToLobby')
def go_back_to_lobby(data):
    '''
    This function is called when a player goes back to their lobby.
    All of the players will follow and 'playersFinished' will be cleared.
    '''
    room = data['room']
    ROOMS[room]['playersFinished'].clear()
    SOCKETIO.emit('goBackToLobby', include_self=False, broadcast=True, room=room)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Tells python where our index file is that renders our React Components"""
    return send_from_directory('../build', filename)


if __name__ == "__main__":
    # pylint: disable=invalid-envvar-default
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081))
    )
