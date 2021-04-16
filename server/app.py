"""This is the main app that serves as a server for all the clients"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO, join_room, leave_room, rooms
from flask_cors import CORS
from collections import OrderedDict

APP = Flask(__name__, static_folder='./build/static')

cors = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''When someone connects to the server'''
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''When someone disconnects to the server'''
    print('User disconnected!')

ROOMS = {}
'''
ROOMS contains a dictionary of room ids, which maps to an ordered dictionary of player stats.
Ex: ROOMS[1234] = {
        'John': 97
        'Matt': 84
    }
}
'''

@SOCKETIO.on('assignPlayerToLobby')
def assign_player_to_lobby(data):
    '''Put the user in a specified room'''
    player_name = data['playerName']
    room = data['room']

    # If assign_player_to_lobby is called with an empty room ID, this user is joining for the first time.
    # In the future, we will generate an ID for them. For now, all players join the "Multiplayer" room.

    if room == "":
        room = "Multiplayer"

    # Join the specified room
    join_room(room)

    # If the 'room' is not in ROOMS then add it
    if room not in ROOMS:
        ROOMS[room] = OrderedDict()

    # If the player is not in the room then add them
    if player_name not in ROOMS[room]:
        ROOMS[room][player_name] = 0

    SOCKETIO.emit('assignPlayerToLobby', {'activePlayers': list(ROOMS[room].keys()), 'room': room}, room=room)

@SOCKETIO.on('updatePlayerStats')
def update_player_stats(data):
    '''A client sends their WPM and the server sends the updated stats to all clients in their room'''
    room = data['room']
    player_name = data['playerName']
    wpm = data['wpm']
    ROOMS[room][player_name] = wpm
    SOCKETIO.emit('updatePlayerStats', {'playerStats': ROOMS[room]}, broadcast=True, room=room)

@SOCKETIO.on('removePlayerFromLobby')
def remove_player_from_lobby(data):
    '''User leaves the room'''
    room = data['room']
    player_name = data['playerName']
    # Remove the player from the room
    ROOMS[room].pop(player_name)
    
    SOCKETIO.emit('updatePlayerStats', {'playerStats': ROOMS[room]})
    SOCKETIO.emit('assignPlayerToLobby', {'activePlayers': list(ROOMS[room].keys()), 'room': room}, room=room)

    leave_room(room)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Tells python where our index file is that renders our React Components"""
    return send_from_directory('./build', filename)


if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
