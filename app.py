"""This is the main app that serves as a server for all the clients"""
import os
from flask import Flask, send_from_directory

APP = Flask(__name__, static_folder='./build/static')


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Tells python where our index file is that renders our React Components"""
    return send_from_directory('./build', filename)


APP.run(
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
