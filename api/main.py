from flask import jsonify, request, send_from_directory
from flask_jwt_extended import (create_access_token, jwt_required,
                                get_jwt, get_jwt_identity, create_refresh_token)
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from config import *
from models import *
import os
import requests

load_dotenv('C:/Users/ANG/Whiplash/api/venv/variables.env')
DEEZER_CHART_BASE_URL = 'https://api.deezer.com/chart/0/'


def convert_song_to_dict(song):
    return {
        'id': song.id,
        'artistId': song.artist_id,
        'songUrl': song.song_url,
        'songTitle': song.song_title
    }


def deezer_chart_requests(query):
    try:
        response = requests.get(DEEZER_CHART_BASE_URL + f'/{query}')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None


@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('isAdmin')
    admin_code = data.get('adminCode')

    if not username or not email or not password:
        return jsonify({"Error": "Data missing!"}), 400

    if is_admin:
        if admin_code != os.getenv('ADMIN_CODE'):
            return jsonify({"Error": "Incorrect Admin Code!"}), 403
        role = 'admin'
    else:
        role = 'user'

    new_user = User(username=username, email=email, role=role)
    new_user.set_id(os.getenv('ID_LETTERS_COUNT'), os.getenv('ID_DIGITS_COUNT'))
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": f"Successfully added {username} to database!"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"Error": "Must fill username and password!"}), 400

    current_user = User.query.filter_by(username=username).first()
    if not current_user:
        return jsonify({"Error": "No existing user with such username"}), 400

    if not current_user.check_password(password):
        return jsonify({"Error": "Wrong Password"}), 417

    access_token = create_access_token(identity=current_user.id, additional_claims={'role': current_user.role})
    refresh_token = create_refresh_token(identity=current_user.id)

    return jsonify({
        "message": "Login successful",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "userId": current_user.id
    }), 201


@app.route("/logout", methods=["DELETE"])
@jwt_required(verify_type=False)
def modify_token():
    token = get_jwt()
    jti = token["jti"]
    ttype = token["type"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, type=ttype, created_at=now))
    db.session.commit()
    return jsonify(msg=f"{ttype.capitalize()} token successfully revoked")


@app.route('/available', methods=['GET'])
def get_tracks_count():
    tracks_count = len(Song.query.all())
    return jsonify({"tracksCount": tracks_count}), 200


@app.route('/tracks', methods=['GET'])
@jwt_required()
def get_all_tracks():
    searched_songs = Song.query.all()
    if not searched_songs:
        return jsonify({"Error": f"No songs were found"}), 404

    json_songs = list(map(lambda song: convert_song_to_dict(song), searched_songs))
    return jsonify(json_songs), 200


@app.route('/available/<string:song_title>', methods=['GET'])
@jwt_required()
def get_song_by_id(song_title):
    searched_songs = Song.query.filter_by(song_title=song_title).all()
    if not searched_songs:
        return jsonify({"Error": f"Song with id: {song_title} was not found"}), 404

    json_songs = list(map(lambda song: convert_song_to_dict(song), searched_songs))
    return jsonify(json_songs), 200


@app.route('/playlists/<string:user_id>', methods=['GET'])
@jwt_required()
def get_playlists(user_id):
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    if not playlists:
        return jsonify({"Error": "No playlists found"}), 404

    json_playlists = list(map(lambda song: convert_song_to_dict(song), playlists))
    return jsonify(playlists=json_playlists), 200


# Admin Panel

@app.route('/add', methods=['POST'])
@jwt_required()
def add_song():
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if not current_user.is_admin():
        return jsonify({"Error": "Admin privileges required"}), 403

    data = request.get_json()
    song_id = data.get('songId')
    artist_id = data.get('artistId')
    song_title = data.get('songTitle')
    song_url = data.get('songUrl')

    new_song = Song(id=song_id, artist_id=artist_id, song_title=song_title, song_url=song_url)
    db.session.add(new_song)
    db.session.commit()
    return jsonify({"message": "Successfully added song to database"}), 201


@app.route('/delete/<int:song_id>', methods=['DELETE'])
@jwt_required()
def delete_song(song_id):
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    if not current_user.is_admin():
        return jsonify({"Error": "Admin privileges required"}), 403

    song_delete = Song.query.get(song_id)
    if not song_delete:
        return jsonify({"Error": f"Song with id: {song_id} could not be found"}), 404

    db.session.delete(song_delete)
    db.session.commit()
    return jsonify({"message": "Successfully deleted song from database"})


# DEEZER API REQUESTS

@app.route('/deezer/chart/tracks', methods=['GET'])
def get_chart_tracks():
    try:
        response = requests.get('https://api.deezer.com/chart/0/tracks')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/chart/artists', methods=['GET'])
def get_chart_artists():
    try:
        response = requests.get('https://api.deezer.com/chart/0/artists')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/chart/playlists', methods=['GET'])
def get_chart_playlists():
    try:
        response = requests.get('https://api.deezer.com/chart/0/playlists')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/<string:filter>/<string:query>', methods=['GET'])
def get_filtered_query(filter, query):
    try:
        response = requests.get(f'https://api.deezer.com/search/{filter}?q={query}')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/<string:query>', methods=['GET'])
def get_query(query):
    try:
        response = requests.get(f'https://api.deezer.com/search?q={query}')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/artists/<string:artist_id>', methods=['GET'])
def get_artist_info(artist_id):
    try:
        response = requests.get(f'https://api.deezer.com/artist/{artist_id}')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/artists/<string:artist_id>/albums', methods=['GET'])
def get_artist_albums(artist_id):
    try:
        response = requests.get(f'https://api.deezer.com/artist/{artist_id}/albums')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/artists/<string:artist_id>/top', methods=['GET'])
def get_artist_top_songs(artist_id):
    try:
        response = requests.get(f'https://api.deezer.com/artist/{artist_id}/top?limit=10')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/albums/<string:album_id>', methods=['GET'])
def get_album_data(album_id):
    try:
        response = requests.get(f'https://api.deezer.com/album/{album_id}')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/albums/<string:album_id>/tracks', methods=['GET'])
def get_album_tracks(album_id):
    try:
        response = requests.get(f'https://api.deezer.com/album/{album_id}/tracks')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/genres', methods=['GET'])
def get_genres():
    try:
        response = requests.get('https://api.deezer.com/genre')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/deezer/tracks/<string:track_id>', methods=['GET'])
def get_track(track_id):
    try:
        response = requests.get(f'https://api.deezer.com/track/{track_id}')
        response.raise_for_status()
        data = response.json()

        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Deezer API data: {e}")
        return jsonify({"error": "Failed to fetch data from Deezer API"}), 500


@app.route('/songs/<filename>')
def serve_song(filename):
    return send_from_directory('songs', filename)


if __name__ == '__main__':
    with app.app_context().push():
        db.create_all()

    app.run(debug=True)
