"""This is the main app that serves as a server for all the clients"""
import os
from collections import OrderedDict
from random import randrange
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

import models  # pylint: disable=wrong-import-position

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)
SESSIONS = {}
'''
SESSIONS contains a dictionary of session ids which map to corresponding player names.
'''

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Tells python where our index file is that renders our React Components"""
    return send_from_directory('../build', filename)

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
# When a client successfully logs in with their Google Account
@SOCKETIO.on('login')
def on_login(data):
    """This is ran when someone presses the login button, it checks to see if that login is already
    in our db, if it isnt, add it! This returns an updated list to the clients"""
    this_user_email = data["email"]
    this_user_name = data["name"]
    db_usersnames, db_emails, db_icons, db_wpms = fetch_db("email") # fetch all users in DB
    print(db_usersnames, db_emails, db_wpms)
    # checks to see if the email exists in our DB, if not add the new users
    user_db_check(this_user_email, db_emails, this_user_name)
    db_usersnames, db_emails, db_icons, db_wpms = fetch_db("email") # refetch all users in DB
    SOCKETIO.emit(
        'iconFromDB',
        {'icon': db_icons[db_emails.index(this_user_email)], 'email': this_user_email},
        broadcast=True,
        room=request.sid
    )

# When a client successfully logs in with their Google Account
@SOCKETIO.on('iconToDB')
def icon_to_db(data):
    """This is ran everytime someone picks a new Icon"""
    user = DB.session.query(models.Users).get(data['email'])
    user.icon = data['emojiID']
    DB.session.commit()
    db_usersnames, db_emails, db_icons, db_wpms = fetch_db(" ")
    print("iconToDB ", db_usersnames, db_emails, db_icons, db_wpms)

@SOCKETIO.on('assignPlayerToLobby')
def assign_player_to_lobby(data):
    '''Put the user in a specified room'''
    player_name = data['playerName']
    room = data['room']
    is_original_room = False
    # If this function is called with an empty room ID, user is joining for the first time
    # We will generate a 4-digit lobby ID for them
    if room == "":
        is_original_room = True
        while True:
            room = str(randrange(10)) + str(randrange(10)) + str(randrange(10)) + str(randrange(10))
            if room not in ROOMS:
                break
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
    SOCKETIO.emit(
        'assignPlayerToLobby',
        {'activePlayers': active_players, 'room': room, 'isOriginalRoom':is_original_room},
        room=room
    )

@SOCKETIO.on('attemptToJoinGame')
def attempt_to_join_game(data):
    '''Attempts to put the player in a room using the room ID they provided'''
    player_name = data['playerName']
    old_room = data['oldRoom']
    new_room = data['newRoom']
    # If the user tries to join a lobby that does not exist, just return
    # We can choose to display an error on the client-side later
    if new_room != "" and new_room not in ROOMS:
        return
    remove_player_from_lobby({'playerName':player_name, 'room':old_room})
    assign_player_to_lobby({'playerName':player_name, 'room':new_room})

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
        # We also include the winning player name in the 'gameComplete' message.
        winning_player = max(ROOMS[room]['activePlayers'], key=ROOMS[room]['activePlayers'].get)
        SOCKETIO.emit('gameComplete', {'winningPlayer': winning_player}, broadcast=True, room=room)

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

def fetch_db(sort_by):
    """This is how we fetch all of the information from Heroku's DB, it also allows us to order
    the information by best wpm or usernames(alphabetical)"""
    if sort_by == "wpm":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.bestwpm.desc()).all()
        return fetch_db_helper(all_users)

    if sort_by == "email":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.email.desc()).all()
        print(all_users)
        return fetch_db_helper(all_users)

    all_users = DB.session.query(models.Users).order_by(
        models.Users.username.asc()).all()
    return fetch_db_helper(all_users)


def user_db_check(this_user_email, db_users_emails, this_user_name):
    """This is to check if the email is already in our database, if it is don't add to the
    database, it is isn't add a new user to the database"""
    if this_user_email in db_users_emails:
        print("Welcome back {}!".format(this_user_email))
    else:
        new_user = models.Users(username=this_user_name,
                                email=this_user_email,
                                icon='smiley',
                                bestwpm=0,
                                averagewpm=0,
                                totalwpm=0,
                                gamesplayed=0,
                                gameswon=0)
        DB.session.add(new_user)
        DB.session.commit()
        db_users_emails.append(this_user_email)
    return db_users_emails


def fetch_db_helper(all_users):
    """This will help fetch the information from the db and return 4 lists, a username list
    an emails list, an icons list, and a bestWPM's list"""
    db_usersnames = []
    db_emails = []
    db_icons = []
    db_bestwpm = []
    for users in all_users:
        db_usersnames.append(users.username)
        db_emails.append(users.email)
        db_icons.append(users.icon)
        db_bestwpm.append(users.bestwpm)
    return db_usersnames, db_emails, db_icons, db_bestwpm

if __name__ == "__main__":
    DB.create_all()
    # pylint: disable=invalid-envvar-default
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081))
    )
