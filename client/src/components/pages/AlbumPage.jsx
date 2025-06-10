import Footer from '../common_components/Footer';
import Navbar from '../common_components/Navbar';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAlbumData, getAlbumTracks } from '../../utils/deezerCalls';
import SongListItem from '../common_components/SongListItem';
import Player from '../common_components/Player';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

const AlbumPage = () => {
    const { albumId } = useParams();

    const [albumData, setAlbumData] = useState(null);
    const [albumTracks, setAlbumTracks] = useState(null);

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    const audioRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        const processAlbum = async () => {
            const data = await getAlbumData(albumId);
            const tracks = await getAlbumTracks(albumId);

            setAlbumData(data);
            setAlbumTracks(tracks);
        }

        processAlbum();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current && audioRef.current.play();
        }
        else {
            audioRef.current && audioRef.current.pause();
        }
    }, [isPlaying, currentSong])

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo('#album-img',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1, delay: 1 });

        gsap.fromTo('#album-name',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1, delay: 1.5 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.current, start: 'center bottom' } })
        tl.fromTo('#tracks-h',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1 }, 1);

        tl.fromTo('.track',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, stagger: 0.2 }, 1.5);
    }, [albumData, albumTracks])

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
        const currSong = albumTracks.find(s => s.id === trackId);
        setCurrentSong(currSong);
        setSelectedTrackId(trackId);
    }

    return (
        <div>
            <Navbar />
            <main className='bg-black p-6'>
                <section className='h-[26rem] md:h-[32rem] w-full relative'>
                    {albumData && <div className='flex justify-center'>
                        <img src={albumData['cover_big']} className='rounded-xl' id='album-img' />
                        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black bg-opacity-50'></div>
                    </div>}
                    {albumData && <h1 id='album-name' className='text-zinc-300 text-6xl z-50 absolute bottom-[13%] md:bottom-[3%] left-[4%] md:left-[20%] lg:left-[27%] xl:left-[34%]'>
                        {albumData.title}
                    </h1>}
                </section>
                <section className='min-h-[44rem] w-full md:p-6 md:pt-10 flex flex-col items-center' ref={scrollRef}>
                    <h1 id='tracks-h' className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text'>
                        Album Tracks
                    </h1>
                    <div className='grid grid-cols-2 grid-flow-row'>
                        {albumTracks && albumTracks.map((track, i) => (
                            <section className='h-full w-full mx-2 md:mx-8 my-2 track'>
                                <SongListItem
                                    key={i}
                                    title={track.title}
                                    album={{'cover_medium': albumData['cover_medium']}}
                                    artist={track.artist}
                                    handleCurrentSong={() => handleCurrentSong(track.id)}
                                />
                            </section>))}
                    </div>
                </section>
            </main>
            {currentSong && <audio src={currentSong.preview} ref={audioRef} onTimeUpdate={onPlaying} />}
            {currentSong && <Player
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                songs={albumTracks}
                setSelectedTrackId={setSelectedTrackId}
                albumData={albumData}
            />}
            <Footer />
        </div>
    );
}

export default AlbumPage;