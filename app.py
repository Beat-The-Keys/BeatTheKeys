import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO, join_room, leave_room
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
def getSend(data):
    socketio.emit('send', {data}, broadcast=True)

# server side code
@socketio.on('create')
def getRoom(data):
    join_room(data['room'])
    socketio.emit('create', {'msg': "New user joined" + data['room']}, broadcast=True, room=data['room'])

@socketio.on('leave')
def getLeave(data):
    leave_room(data['room'])
    socketio.send({'msg': "user left" + data['room']}, room=data['room'])

app.run(
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
