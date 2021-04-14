"""This is the main app that serves as a server for all the clients"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS

APP = Flask(__name__, static_folder='./build/static')

cors = CORS(APP, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    '''When someone connects to the server'''
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    '''When someone disconnects to the server'''
    print('User disconnected!')

USERS = {
    'everyone': []
}

@socketio.on('getUsers')
def get_users(data):
    '''Send data to all the clients'''

    #if the players is not in the every active player list add it
    if(data['playerName'] not in USERS['everyone']):
        USERS['everyone'].append(data['playerName'])

    socketio.emit('getUsers', USERS['everyone'], broadcast=True)

USER_STATS = {}
# server side code
@socketio.on('joinRoom')
def join_rooms(data):
    '''Put the user in a specified room'''

    #Join the specified room
    join_room(data['room'])

    #if the 'room' is not in the USERS dic then add it
    if(data['room'] not in USERS):
        USERS[data['room']] = []

    #if the player is not in the rooms list, add it
    if(data['playerName'] not in USERS[data['room']]):
        USERS[data['room']].append(data['playerName'])



@socketio.on('playerStats')
def get_player_stats(data):
    '''A client sends their WPM and the server sends the updated stats to all clients'''

    #update the currents users wpm
    USER_STATS[data['playerName']] = data['wpm']
    print(USER_STATS)
    socketio.emit('playerStats', {'playerStats': USER_STATS}, broadcast=True, room=data['room'])

@socketio.on('leaveRoom')
def leave_rooms(data):
    '''User leaves the room'''

    leave_room(data['room'])

    #get the users index in a given room, and get rid of it
    USER_INDEX = USERS[data['room']].index(data['playerName'])
    USERS[data['room']].pop(USER_INDEX)

    #get rid of the wpm for the user that left
    USER_STATS.pop(data['playerName'])

    socketio.emit('playerStats', {'playerStats': USER_STATS}, broadcast=True, room=data['room'])


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Tells python where our index file is that renders our React Components"""
    return send_from_directory('./build', filename)


APP.run(
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)