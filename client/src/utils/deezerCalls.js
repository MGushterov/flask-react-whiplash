import axios from 'axios';

export const getChartData = async (query) => {
    const response = await axios.get(`http://127.0.0.1:5000/deezer/chart/${query}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data.data;
}

export const getGenres = async () => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/genres`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data.data
}

export const getSearchData = async (filter, query) => {
    if(filter) {
        const { data } = await axios.get(`http://127.0.0.1:5000/deezer/${filter}/${query}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data.data
    }
    else {
        const { data } = await axios.get(`http://127.0.0.1:5000/deezer/${query}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data.data
    }
}

export const getArtistData = async (artistId) => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/artists/${artistId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data;
}

export const getArtistTopTracks = async (artistId) => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/artists/${artistId}/top`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data.data;
}

export const getArtistAlbums = async (artistId) => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/artists/${artistId}/albums`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data.data;
}

export const getAlbumData = async (albumId) => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/albums/${albumId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data;
}

export const getAlbumTracks = async (albumId) => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/albums/${albumId}/tracks`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data.data;
}

export const getTrackInfo = async (trackId) => {
    const { data } = await axios.get(`http://127.0.0.1:5000/deezer/tracks/${trackId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return data;
}

export const getExtraData = async (songs) => {
    try {
        const songsWithExtraData = await Promise.all(
            songs.map(async (song) => {
                try {
                    const extraData = await getTrackInfo(song.id);
                    return {
                        ...song,
                        album: extraData.album,
                        artist: extraData.artist,
                    };
                } catch (error) {
                    console.error(`Error fetching extra data for song ${song.id}:`, error);
                    return { ...song, album: null, artist: null };
                }
            })
        );
        return songsWithExtraData;
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}