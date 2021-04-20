"""Imports the SQLAlchemy schema. Allows us to do DB.Model"""
from app import DB

class Users(DB.Model):
    """This is the schema for our users. It includes a username, email, selected icon,
    and best WPM"""
    username = DB.Column(DB.String(80),
                         nullable=False)
    email = DB.Column(DB.String(80),
                      unique=True,
                      primary_key=True,
                      nullable=False)
    icon = DB.Column(DB.String(80))
    bestwpm = DB.Column(DB.Integer)

    def __repr__(self):
        # This allows us to access the DB Model schema for each entity. Used for server debugging
        return '<Users %r>' % self.username
