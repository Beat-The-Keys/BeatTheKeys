"""This is the main app that serves as a server for all the clients"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO, join_room, leave_room, rooms
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

@socketio.on('send')
def get_send(data):
    '''Send data to all the clients'''
    print(data)
    print("send\n\n", rooms(), "\n\n")
    socketio.emit('send', data, broadcast=True, room=data['room'])

USERS = []
USER_STATS = {}
# server side code
@socketio.on('joinRoom')
def join_rooms(data):
    '''Put the user in a specified room'''
    join_room(data['room'])
    USERS.append(data['playerName'])
    USER_STATS[data['playerName']] = 0
    print("join\n\n", rooms(), "\n\n")
    dic = {}
    dic['msg'] = "New user joined" + data['playerName']
    dic['users'] = USERS
    socketio.emit('joinRoom', dic, broadcast=True, room=data['room'])

@socketio.on('playerStats')
def get_player_stats(data):
    '''A client sends their WPM and the server sends the updated stats to all clients'''
    USER_STATS[data['playerName']] = data['wpm']
    print(USER_STATS)
    socketio.emit('playerStats', {'playerStats': USER_STATS}, broadcast=True, room=data['room'])

@socketio.on('leaveRoom')
def leave_rooms(data):
    '''User leaves the room'''
    leave_room(data['room'])
    dic = {}
    dic['msg'] = data['userName'] + "left"
    socketio.emit('leaveRoom', dic, broadcast=True, room=data['room'])

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Tells python where our index file is that renders our React Components"""
    return send_from_directory('./build', filename)


APP.run(
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
