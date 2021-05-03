"""This is the main app that serves as a server for all the clients"""
import os
from collections import OrderedDict
from random import randrange, choice
from pathlib import Path
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
PROMPT_FILES = ['server/prompts/' + path for path in os.listdir('server/prompts/')]
SESSIONS = {}
'''
SESSIONS contains a dictionary of session ids which map to corresponding player names.
'''

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''Tells python where our index file is that renders our React Components'''
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
                name = ROOMS[room]['activePlayers'][disconnected_player][4]
                remove_player_from_lobby({'playerEmail':disconnected_player,
                                          'room':room,
                                          'playerName': name})
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

def send_ready_up_status(room):
    '''Sends a list of ready players and whether all players are ready to the client'''
    ready_players = []
    for key in ROOMS[room]['activePlayers'].keys():
        if ROOMS[room]['activePlayers'][key][2]:
            ready_players.append(key)
    all_players_ready = len(ready_players) == len(ROOMS[room]['activePlayers'].keys())
    print(ROOMS[room]['activePlayers'].keys())
    SOCKETIO.emit(
        'playerChangedReady',
        {'readyPlayers': ready_players, 'allPlayersReady':all_players_ready},
        broadcast=True,
        include_self=True,
        room=room
    )
    return (ready_players, all_players_ready)

def check_game_complete(room):
    ''' Checks if the game is over and sends a message that contains the winner to each client'''
    active_players = []
    for player in ROOMS[room]['activePlayers'].keys():
        if not ROOMS[room]['activePlayers'][player][3]:
            active_players.append(ROOMS[room]['activePlayers'][player][4])
    active_players_set = set(active_players)
    players_finished_set = set(ROOMS[room]['playersFinished'])
    if players_finished_set == active_players_set:
        # We also include the winning player name in the 'gameComplete' message.
        winning_player = max(ROOMS[room]['activePlayers'], key=ROOMS[room]['activePlayers'].get)

        if len(ROOMS[room]['activePlayers']) != 1:
            update_db_gameswon(winning_player)

        ROOMS[room]['gameInProgress'] = False
        for player in ROOMS[room]['activePlayers'].keys():
            ROOMS[room]['activePlayers'][player][3] = False
        ROOMS[room]['playersFinished'].clear()
        SOCKETIO.emit('gameComplete',
                      {'winningPlayer': winning_player}, broadcast=True, room=room)

# When a client successfully logs in with their Google Account
@SOCKETIO.on('login')
def on_login(data):
    '''This is ran when someone presses the login button, it checks to see if that login is already
    in our db, if it isnt, add it! This returns an updated list to the clients'''
    this_user_email = data["email"]
    this_username = data["name"]
    db_emails, db_icons = fetch_db("email")[1:3]
    # checks to see if the email exists in our DB, if not add the new users

    user_db_check(this_user_email, db_emails, this_username)
    db_emails, db_icons = fetch_db("email")[1:3]
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
    room = data['room']
    player_email = data['playerEmail']
    user = DB.session.query(models.Users).get(player_email)
    user.icon = data['emojiID']
    DB.session.commit()
    # print("iconToDB ", db_usersnames, db_emails, db_icons, db_wpms)
    ROOMS[room]['activePlayers'][player_email] = [0, data['emojiID']]
    active_players = ROOMS[room]['activePlayers']
    SOCKETIO.emit(
        'assignPlayerToLobby',
        {'activePlayers': active_players, 'room': room},
        room=room
    )

def get_icons(player_email):
    '''Gets the players icon'''
    db_emails, db_icons = fetch_db("email")[1:3] # fetch all users in DB
    # print("iconToDB ", db_usersnames, db_emails, db_icons, db_wpms)
    if player_email in db_emails:
        i = db_emails.index(player_email)
    else:
        return 'smiley'
    return db_icons[i]

@SOCKETIO.on('playerAchievements')
def player_achievements(data):
    '''
    This function will be called when the player views their achievements
    This is currently just skeleton code and will be implemented later
    '''
    achievements = {}

    this_user_email = data['playerEmail']
    this_user = DB.session.query(models.Users).get(this_user_email)
    best_wpm = this_user.bestwpm
    games_played = this_user.gamesplayed
    games_won = this_user.gameswon

    if games_played != 0:
        avg_wpm = this_user.totalwpm/games_played

    else:
        avg_wpm = 0

    games_ctr = 5
    games_won_ctr = 5
    avg_wpm_ctr = 50
    best_wpm_ctr = 60

    while games_ctr <= games_played:
        achievements['Play {} Games'.format(games_ctr)] = {'progress': games_ctr,
                                                           'total': games_ctr}
        games_ctr += 15

    while games_won_ctr <= games_won:
        achievements['Won {} Games'.format(games_won_ctr)] = {'progress': games_won_ctr,
                                                              'total': games_won_ctr}
        games_won_ctr += 5

    while avg_wpm_ctr <= avg_wpm:
        achievements['Average WPM of {}'.format(avg_wpm_ctr)] = {'progress': avg_wpm_ctr,
                                                                 'total': avg_wpm_ctr}
        avg_wpm_ctr += 15

    while best_wpm_ctr <= best_wpm:
        achievements[' Best WPM of {}'.format(best_wpm_ctr)] = {'progress': best_wpm_ctr,
                                                                'total': best_wpm_ctr}
        best_wpm_ctr += 15


    achievements['Play {} Games'.format(games_ctr)] = {'progress': games_played,
                                                       'total': games_ctr}
    achievements['Won {} Games'.format(games_won_ctr)] = {'progress': games_won,
                                                          'total': games_won_ctr}
    achievements['Average WPM of {}'.format(avg_wpm_ctr)] = {'progress': avg_wpm,
                                                             'total': avg_wpm_ctr}
    achievements['Best WPM of {}'.format(best_wpm_ctr)] = {'progress': best_wpm,
                                                           'total': best_wpm_ctr}

    SOCKETIO.emit(
        'playerAchievements',
        {'achievements': achievements},
        room=request.sid
    )


@SOCKETIO.on('assignPlayerToLobby')
def assign_player_to_lobby(data):
    """Put the user in a specified room"""
    player_email = data['playerEmail']
    room = data['room']
    player_name = data['playerName']

    print("assign", player_email)
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
        ROOMS[room]['gameInProgress'] = False
    # If the player is not in the room then add them

    if player_email not in ROOMS[room]:
        player_joined_late = ROOMS[room]['gameInProgress']
        icon = get_icons(player_email)
        ROOMS[room]['activePlayers'][player_email] = [0, icon, False,
                                                      player_joined_late, player_name]
        SESSIONS[request.sid] = player_email
    active_players = ROOMS[room]['activePlayers']
    send_ready_up_status(room)
    SOCKETIO.emit(
        'assignPlayerToLobby',
        {'activePlayers': active_players,
         'room': room,
         'isOriginalRoom':is_original_room,
         'gameInProgress': ROOMS[room]['gameInProgress']},
        room=room
    )

@SOCKETIO.on('attemptToJoinGame')
def attempt_to_join_game(data):
    '''Attempts to put the player in a room using the room ID they provided'''
    player_email = data['playerEmail']
    old_room = data['oldRoom']
    new_room = data['newRoom']
    player_name = data['playerName']
    # If the user tries to join a lobby that does not exist, just return
    # We can choose to display an error on the client-side later
    if new_room != "" and new_room not in ROOMS:
        return

    remove_player_from_lobby({'playerEmail':player_email,
                              'room':old_room,
                              'player_name': player_name})
    assign_player_to_lobby({'playerEmail': player_email,
                            'room':new_room,
                            'player_name':player_name})

@SOCKETIO.on('updatePlayerStats')
def update_player_stats(data):
    '''Clients send their WPM and the server sends updated stats to all clients in the room'''
    room = data['room']
    player_email = data['playerEmail']
    wpm = data['wpm']

    ROOMS[room]['activePlayers'][player_email][0] = wpm
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
    player_email = data['playerEmail']
    player_name = data['playerName']
    # Remove the player from the room
    ROOMS[room]['activePlayers'].pop(player_email, None)
    if player_name in ROOMS[room]['playersFinished']:
        ROOMS[room]['playersFinished'].remove(player_name)
    SOCKETIO.emit(
        'updatePlayerStats', {'playerStats': ROOMS[room]['activePlayers']},
        broadcast=True,
        room=room
    )
    send_ready_up_status(room)
    active_players = ROOMS[room]['activePlayers']
    # assignPlayerToLobby is used to refresh the lobby for all players.
    # We can change up the name later to avoid confusion.
    SOCKETIO.emit(
        'assignPlayerToLobby', {'activePlayers': active_players, 'room': room},
        broadcast=True,
        room=room
    )
    # It is possible for someone to leave mid-game when the rest of the players are finished.
    # We should show a game over in this case.
    if ROOMS[room]['gameInProgress']:
        check_game_complete(room)
    leave_room(room)

@SOCKETIO.on('playerChangedReady')
def player_changed_ready(data):
    '''Player changed their ready state'''
    player_email = data['playerEmail']
    is_ready = data['isReady']
    room = data['room']
    ROOMS[room]['activePlayers'][player_email][2] = is_ready
    send_ready_up_status(room)

@SOCKETIO.on('startGame')
def start_game(data):
    '''Starts the game for all players in a lobby'''
    room = data['room']
    ROOMS[room]['gameInProgress'] = True
    prompt = Path(choice(PROMPT_FILES)).read_text().replace('\n', '')
    SOCKETIO.emit('startGame', {'prompt': prompt}, broadcast=True, include_self=True, room=room)

@SOCKETIO.on('playerFinished')
def player_finished(data):
    '''A client sends a message when they finished the game. Eventually we should check if
    the user achieved their best WPM here and store it in our db'''
    wpm = data['wpm']
    email = data['playerEmail']
    name = data['playerName']

    room = data['room']
    ROOMS[room]['playersFinished'].append(name)
    SOCKETIO.emit(
        'playersFinished', {'playersFinished': ROOMS[room]['playersFinished']},
        broadcast=True,
        room=room
    )
    # If all the players in the room are finished, send a 'gameComplete' message to every client
    # Comparing lists will also check item order by default, so instead we can use sets.

    check_game_complete(room)

    if len(ROOMS[room]['activePlayers']) != 1:
        update_db_gamesplayed(email)

    # we will allow the user to improve their best wpm in a solo game
    bestwpm_db_check(email, wpm, len(ROOMS[room]['activePlayers']))

@SOCKETIO.on('goBackToLobby')
def go_back_to_lobby(data):
    '''This function is called when a player goes back to their lobby.
    All of the players will follow and 'playersFinished' will be cleared'''
    room = data['room']
    SOCKETIO.emit('goBackToLobby', include_self=False, broadcast=True, room=room)


@SOCKETIO.on('leaderboard')
def on_leaderboard_query(data):
    '''This function is called when the leaderboard is being rendered. It fetches data from
    the database and then calculates everyones avg wpm and send all the info back to the client'''
    if data["sort_query"] != "avgwpm":
        db_usersnames, db_emails = fetch_db(data["sort_query"])[0:2]
        db_bestwpm, db_totalwpm, db_gamesplayed, db_gameswon = fetch_db(data["sort_query"])[3:]
        calculate_avg = find_average(db_totalwpm, db_gamesplayed)
        db_avgwpm = calculate_avg
    else:
        db_usersnames, db_emails = fetch_db(data["sort_query"])[0:2]
        db_bestwpm, db_totalwpm, db_gamesplayed, db_gameswon = fetch_db(data["sort_query"])[3:]
        calculated_avg = find_average(db_totalwpm, db_gamesplayed)
        data = sort_avg_wpm(db_usersnames, db_emails, db_bestwpm,
                            calculated_avg, db_gamesplayed, db_gameswon)
        db_usersnames, db_emails, db_bestwpm, db_avgwpm, db_gamesplayed, db_gameswon = data
    SOCKETIO.emit('updateLeaderboard', {'db_usersnames': db_usersnames,
                                        'db_bestwpm': db_bestwpm,
                                        'db_avgwpm': db_avgwpm,
                                        'db_gamesplayed': db_gamesplayed,
                                        'db_gameswon': db_gameswon},
                  broadcast=True,
                  include_self=True)


def fetch_db(sort_by):
    '''This is how we fetch all of the information from Heroku's DB, it also allows us to order
    the information by best wpm/emails(alphabetical)/gameswon'''
    if sort_by == "bestwpm":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.bestwpm.desc()).all()
        return fetch_db_helper(all_users)

    if sort_by == "gamesplayed":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.gamesplayed.desc()).all()
        return fetch_db_helper(all_users)

    if sort_by == "gameswon":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.gameswon.desc()).all()
        return fetch_db_helper(all_users)

    if sort_by == "avgwpm":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.totalwpm.desc()).all()
        return fetch_db_helper(all_users)

    if sort_by == "email":
        all_users = DB.session.query(models.Users).order_by(
            models.Users.email.desc()).all()
        return fetch_db_helper(all_users)

    return fetch_db_helper(all_users)


def bestwpm_db_check(this_user_email, this_user_wpm, active_players_len):
    '''This is to check if the wpm that was just calculated is bigger than the
    best wpm stored in DB. If it is, replace, if not do nothing. Also it adds wpm to each
    totalwpm of each player.'''
    this_user = DB.session.query(models.Users).get(this_user_email)
    db_user_bestwpm = this_user.bestwpm
    if active_players_len != 1:
        this_user.totalwpm = this_user.totalwpm + this_user_wpm
        DB.session.commit()

    if this_user_wpm > db_user_bestwpm:
        this_user.bestwpm = this_user_wpm
        DB.session.commit()

def update_db_gamesplayed(this_user_email):
    '''This is to update all the players gamesplayed column'''
    this_user = DB.session.query(models.Users).get(this_user_email)
    this_user.gamesplayed = this_user.gamesplayed + 1
    DB.session.commit()

def user_db_check(this_user_email, db_users_emails, this_user_name):
    '''This is to check if the email is already in our database, if it is don't add to the
    database, it is isn't add a new user to the database'''
    if this_user_email in db_users_emails:
        print("Welcome back {}!".format(this_user_email))
    else:
        new_user = models.Users(username=this_user_name,
                                email=this_user_email,
                                icon='smiley',
                                bestwpm=0,
                                totalwpm=0,
                                gamesplayed=0,
                                gameswon=0)
        DB.session.add(new_user)
        DB.session.commit()
        db_users_emails.append(this_user_email)
    return db_users_emails

def update_db_gameswon(this_user_email):
    '''This is to update the winners gameswon column'''
    this_user = DB.session.query(models.Users).get(this_user_email)
    this_user.gameswon = this_user.gameswon + 1
    DB.session.commit()


def find_average(totalwpm, totalgames):
    '''This function is a helper function that calculates all of the users avg
    wpm and sends back a list of user avg wpms'''
    avg_wpm = []
    # ignore this pylint error as we need to iterate using indexes as im walking 2 lists
    for i in range(len(totalwpm)): # pylint: disable=consider-using-enumerate
        if totalgames[i] != 0:
            tmp = totalwpm[i]/totalgames[i]
            avg_wpm.append(round(tmp, 2))
        else:
            avg_wpm.append(0)
    return avg_wpm

# pylint: disable=too-many-arguments
def sort_avg_wpm(db_usersnames, db_emails, db_bestwpm, calculated_avg, db_gamesplayed, db_gameswon):
    '''This function is a helper function that sorts the list of sorted avg wpm and maintains that
    all the data matches the database. I ignored this pylint error as I need to pass all these
    lists to the function'''
    sort_names = []
    sort_emails = []
    sort_best_wpm = []
    sort_avg = []
    sort_games_played = []
    sort_games_won = []

    while len(calculated_avg) != 0:
        max_index = calculated_avg.index(max(calculated_avg))
        sort_names.append(db_usersnames.pop(max_index))
        sort_emails.append(db_emails.pop(max_index))
        sort_best_wpm.append(db_bestwpm.pop(max_index))
        sort_avg.append(calculated_avg.pop(max_index))
        sort_games_played.append(db_gamesplayed.pop(max_index))
        sort_games_won.append(db_gameswon.pop(max_index))

    return sort_names, sort_emails, sort_best_wpm, sort_avg, sort_games_played, sort_games_won


def fetch_db_helper(all_users):
    '''This will help fetch the information from the db and return 4 lists, a username list
    an emails list, an icons list, and a bestWPM's list'''
    db_usersnames = []
    db_emails = []
    db_icons = []
    db_bestwpm = []
    db_totalwpm = []
    db_gamesplayed = []
    db_gameswon = []
    for users in all_users:
        db_usersnames.append(users.username)
        db_emails.append(users.email)
        db_icons.append(users.icon)
        db_bestwpm.append(users.bestwpm)
        db_totalwpm.append(users.totalwpm)
        db_gamesplayed.append(users.gamesplayed)
        db_gameswon.append(users.gameswon)
    return db_usersnames, db_emails, db_icons, db_bestwpm, db_totalwpm, db_gamesplayed, db_gameswon

if __name__ == "__main__":
    DB.create_all()
    # pylint: disable=invalid-envvar-default
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081))
    )
