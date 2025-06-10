from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import secrets

app = Flask(__name__)

ACCESS_EXPIRE = timedelta(days=30)

CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", secrets.token_hex(16))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRE
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3)
jwt = JWTManager(app)


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music_library.db'
db = SQLAlchemy(app)
