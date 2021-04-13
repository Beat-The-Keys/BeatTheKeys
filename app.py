'''Server side'''
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO, join_room, leave_room, rooms
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')


cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    '''Initial function for server-side socketio'''
    return send_from_directory('./build', filename)


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
# server side code
@socketio.on('joinRoom')
def join_rooms(data):
    '''Put the user in a specified room'''
    join_room(data['room'])
    USERS.append(data['userName'])
    print("join\n\n", rooms(), "\n\n")
    dic = {}
    dic['msg'] = "New user joined" + data['userName']
    dic['users'] = USERS
    socketio.emit('joinRoom', dic, broadcast=True, room=data['room'])

@socketio.on('leaveRoom')
def leave_rooms(data):
    '''User leaves the room'''
    leave_room(data['room'])
    dic = {}
    dic['msg'] = data['userName'] + "left"
    socketio.emit('leaveRoom', dic, broadcast=True, room=data['room'])

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
