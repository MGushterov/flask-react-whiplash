from flask_jwt_extended import get_current_user
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import relationship
from config import db
import random
import string


class User(db.Model):
    id = db.Column(db.String(9), primary_key=True, unique=True)
    email = db.Column(db.String(64), index=True, unique=True, nullable=False)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(10), default='user')
    playlists = db.relationship('Playlist', back_populates='user')

    def set_id(self, letters_count, digits_count):
        letters, digits = [], []
        for i in range(int(letters_count)):
            letters.append(random.choice(string.ascii_letters))

        for i in range(int(digits_count)):
            digits.append(random.choice(string.digits))

        sample_list = letters + digits
        random.shuffle(sample_list)

        self.id = ''.join(sample_list)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'


class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, nullable=False)
    song_url = db.Column(db.String(128), nullable=False, unique=True)
    song_title = db.Column(db.String(64), nullable=False)
    playlists = relationship('Playlist', secondary='playlist_songs', back_populates='songs')


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = relationship('User', back_populates='playlists')
    songs = relationship('Song', secondary='playlist_songs', back_populates='playlists')


playlist_songs = db.Table('playlist_songs',
                          db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'), primary_key=True),
                          db.Column('song_id', db.Integer, db.ForeignKey('song.id'), primary_key=True))


class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    type = db.Column(db.String(16), nullable=False)
    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )
