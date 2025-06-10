import { getCookie } from "../../utils/cookies";
import { jwtDecode } from 'jwt-decode'
import Footer from "../common_components/Footer"
import Navbar from "../common_components/Navbar";
import { getAvailableSongs, getSongsByTitle, getUserPlaylists } from "../../utils/dbCalls";
import { useEffect, useRef, useState } from "react";
import Player from "../common_components/Player";
import SongListItem from "../common_components/SongListItem";
import { getExtraData, getTrackInfo } from "../../utils/deezerCalls";

const BASE_URL = 'http://127.0.0.1:5000';

const Library = () => {
    const [songs, setSongs] = useState([]);
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    const [inputData, setInputData] = useState({ search: '' });
    const [isRefreshed, setIsRefreshed] = useState(false);

    const audioRef = useRef();

    useEffect(() => {
        const handleSongs = async () => {
            const data = await getAvailableSongs();
            const songs = await getExtraData(data);
            setSongs(songs)
        }

        const handlePlaylists = async () => {
            const data = await getUserPlaylists();
            
        }

        handleSongs();
    }, [isRefreshed])

    useEffect(() => {
        if (isPlaying) {
            audioRef.current && audioRef.current.play();
        }
        else {
            audioRef.current && audioRef.current.pause();
        }
    }, [isPlaying, currentSong])

    const onPlaying = () => {
        const duration = audioRef.current.duration;
        const currTime = audioRef.current.currentTime;

        setCurrentSong(prevSongState => ({
            ...prevSongState,
            'progress': currTime / duration * 100,
            'length': duration
        }))
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setInputData(prevInput => ({
            ...prevInput,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const getData = async () => {
            const songs = await getSongsByTitle(inputData.search);
            const extraSongs = await getExtraData(songs);
            setSongs(extraSongs);
        }
        getData();
    }

    const handleRefresh = () => {
        setInputData({ search: '' });
        setIsRefreshed(prev => !prev);
    }

    const loadSongListItem = (data, index) => {
        return <SongListItem
            key={index}
            title={data.songTitle}
            album={data.album}
            artist={data.artist}
            handleCurrentSong={() => setCurrentSong(data)}
        />
    }

    return (
        <div>
            <Navbar />
            <section className='bg-black h-32 w-full flex justify-center items-center p-2'>
                <svg xmlns=' http://www.w3.org/2000/svg' fill=' none' viewBox=' 0 0 24 24' strokeWidth={1.5} stroke=' currentColor' className=' size-7 md:size-9 text-zinc-600 mr-4 cursor-pointer' onClick={handleRefresh}>
                    <path strokeLinecap=' round' strokeLinejoin=' round' d=' M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99' />
                </svg>
                <input
                    type='text'
                    name='search'
                    value={inputData.search}
                    placeholder='Search songs, artists and albums'
                    onChange={handleChange}
                    className='h-[40%] w-[50%] md:w-[30%] text-center text-zinc-400 placeholder-zinc-500 
                        rounded-3xl lg:rounded-xl shadow-lg shadow-zinc-500 bg-zinc-900 text-small md:text-lg lg:text-xl
                        focus:outline-none px-2 overflow-hidden font-sans'
                />
                <svg xmlns=' http://www.w3.org/2000/svg' fill=' none' viewBox=' 0 0 24 24' strokeWidth={1.5} stroke=' currentColor' className=' size-7 md:size-9 text-zinc-600 ml-4 cursor-pointer' onClick={handleSubmit}>
                    <path strokeLinecap=' round' strokeLinejoin=' round' d=' m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                </svg>
            </section>
            <main>
                <section className='bg-black p-2'>
                    <h1 className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text ml-[30%] md:ml-[11%]'>
                        Songs in the Library
                    </h1>
                    <div className='min-h-[36rem] w-full md:grid grid-cols-2 justify-items-center flex flex-col justify-around items-center touch-pan-y'>
                        {songs && songs.slice(0, 14).map((singleData, i) => singleData.album && loadSongListItem(singleData, i))}
                    </div>
                </section>
            </main>
            {currentSong && <audio src={`${BASE_URL}/songs/${currentSong.songUrl}`} ref={audioRef} onTimeUpdate={onPlaying} />}
            {currentSong && <Player
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                songs={songs}
                setSelectedTrackId={setSelectedTrackId}
            />}
            <Footer />
        </div>
    );
}

export default Library;