import Footer from '../common_components/Footer';
import Navbar from '../common_components/Navbar';
import { useEffect, useState, useRef } from 'react';
import { getChartData } from '../../utils/deezerCalls';
import SongListItem from '../common_components/SongListItem';
import ArtistListItem from '../common_components/ArtistListItem';
import Player from '../common_components/Player';
import { Link } from 'react-router-dom';

const Popular = () => {
    const [tracksData, setTracksData] = useState([]);
    const [artistsData, setArtistsData] = useState([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    const audioRef = useRef();

    useEffect(() => {
        const getTracksData = async () => {
            const data = await getChartData('tracks');
            console.log(data);
            setTracksData(data);
        }

        const getArtistsData = async () => {
            const data = await getChartData('artists');
            setArtistsData(data);
        }

        getTracksData();
        getArtistsData();
    }, [])

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

    const handleCurrentSong = (trackId) => {
        const currSong = tracksData.find(s => s.id === trackId);
        setCurrentSong(currSong);
        setSelectedTrackId(trackId);
    }

    return (
        <div>
            <Navbar />
            <main className='bg-black flex flex-col p-2 md:p-16'>
                <h1 className='text-zinc-200 text-2xl md:text-6xl mb-8'>Top Songs</h1>
                <article className='grid grid-rows-5 grid-cols-2 grid-flow-col'>
                    {tracksData.map((track, i) => (
                        <SongListItem 
                            key={i}
                            handleCurrentSong={() => setCurrentSong(track)}
                            {...track}
                        />
                    ))}
                </article>
                <h1 className='text-zinc-200 text-2xl md:text-6xl my-8'>Top Artists</h1>
                <article className='grid grid-rows-5 grid-cols-2 grid-flow-col'>
                    {artistsData.map((artist, i) => (
                        <Link to={`/artist/${artist.id}`}> 
                            <ArtistListItem 
                                key={i}
                                {...artist}
                            />
                        </Link>
                    ))}
                </article>
            </main>
            {currentSong && <audio src={currentSong.preview} ref={audioRef} onTimeUpdate={onPlaying} />}
            {currentSong && <Player
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                songs={tracksData}
                setSelectedTrackId={setSelectedTrackId}
            />}
            <Footer />
        </div>
    );
}

export default Popular;