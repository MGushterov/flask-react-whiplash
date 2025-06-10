import Footer from '../common_components/Footer';
import Navbar from '../common_components/Navbar';
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArtistData, getArtistTopTracks, getArtistAlbums } from '../../utils/deezerCalls';
import SongListItem from '../common_components/SongListItem';
import AlbumListItem from '../common_components/AlbumListItem';
import Player from '../common_components/Player';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

const ArtistPage = () => {
    const { artistId } = useParams();

    const [artistData, setArtistData] = useState(null);
    const [artistTracks, setArtistTracks] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    const audioRef = useRef();
    const scrollRef = useRef();
    const scrollRef2 = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);

        const processArtist = async () => {
            const data = await getArtistData(artistId);
            const tracks = await getArtistTopTracks(artistId);
            const albums = await getArtistAlbums(artistId);

            setArtistData(data);
            setArtistTracks(tracks);
            setArtistAlbums(albums.slice(0, 10));
        }

        processArtist();
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

        gsap.fromTo('#artist-img',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1, delay: 1 });

        gsap.fromTo('#artist-name',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1, delay: 1.5 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.current, start: 'center bottom' } })
        tl.fromTo('#tracks-h',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1 }, 1);

        tl.fromTo('.track',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, stagger: 0.2 }, 1.5);

        const tl2 = gsap.timeline({ scrollTrigger: { trigger: scrollRef2.current, start: 'center bottom' } })
        tl2.fromTo('#albums-h',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 1 }, 1);

        tl2.fromTo('.album',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, stagger: 0.2 }, 1.5);
    }, [artistData, artistTracks, artistAlbums])

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
        const currSong = artistTracks.find(s => s.id === trackId);
        setCurrentSong(currSong);
        setSelectedTrackId(trackId);
    }

    return (
        <div>
            <Navbar />
            <main className='bg-black p-6'>
                <section className='h-[26rem] md:h-[32rem] w-full relative'>
                    {artistData && <div className='flex justify-center'>
                        <img src={artistData['picture_big']} className='rounded-xl' id='artist-img' />
                        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black bg-opacity-50'></div>
                    </div>}
                    {artistData && <h1 id='artist-name' className='text-zinc-300 text-6xl z-50 absolute bottom-[13%] md:bottom-[3%] left-[4%] md:left-[20%] lg:left-[27%] xl:left-[34%]'>
                        {artistData.name}
                    </h1>}
                </section>
                <section className='h-[44rem] w-full md:p-6 md:pt-10 flex flex-col items-center' ref={scrollRef}>
                    <h1 id='tracks-h' className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text'>
                        Top Tracks
                    </h1>
                    <div className='grid grid-rows-5 grid-cols-2 grid-flow-col'>
                        {artistTracks && artistTracks.map((track, i) => (
                            <section className='h-full w-full mx-2 md:mx-8 my-2 track'>
                                <SongListItem
                                    key={i}
                                    title={track.title}
                                    album={track.album}
                                    artist={track.artist}
                                    handleCurrentSong={() => handleCurrentSong(track.id)}
                                />
                            </section>))}
                    </div>
                </section>
                <section className='h-[44rem] w-full md:p-6 md:pt-10 flex flex-col items-center' ref={scrollRef2}>
                    <h1 id='albums-h' className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text'>
                        Top Albums
                    </h1>
                    <div className='grid grid-rows-5 grid-cols-2 grid-flow-col'>
                        {artistAlbums && artistAlbums.map((album, i) => (
                            <section className='h-full w-full mx-2 md:mx-8 my-2 album'>
                                <Link to={`/album/${album.id}`}>
                                    <AlbumListItem
                                        key={i}
                                        title={album.title}
                                        artist={{ name: artistData.name }}
                                        cover={album['cover_medium']}
                                        handleCurrentSong={() => handleCurrentSong(album.id)}
                                        />
                                </Link>
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
                songs={artistTracks}
                setSelectedTrackId={setSelectedTrackId}
            />}
            <Footer />
        </div>
    );
}

export default ArtistPage;