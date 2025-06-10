import { useState, useEffect, useRef } from 'react';
import { getCookie } from '../../utils/cookies';
import Footer from '../common_components/Footer'
import Navbar from '../common_components/Navbar';
import { getChartData, getSearchData, getGenres } from '../../utils/deezerCalls';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import ArtistListItem from '../common_components/ArtistListItem';
import AlbumListItem from '../common_components/AlbumListItem';
import SongListItem from '../common_components/SongListItem';
import Player from '../common_components/Player';
import { Link } from 'react-router-dom';


const Explore = () => {
    // state hooks
    const [motivationList, setMotivationList] = useState([]);
    const [genres, setGenres] = useState([]);
    const [topTracks, setTopTracks] = useState([]);

    const [dataToDisplay, setDataToDisplay] = useState(null);

    const [filterClicked, setFilterClicked] = useState(false);
    const [inputData, setInputData] = useState({ filter: '', search: '' });

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [songs, setSongs] = useState(null);

    // ref hooks
    const scrollRef1 = useRef(null);
    const scrollRef2 = useRef(null);

    const audioRef = useRef();

    // effect hooks
    useEffect(() => {
        const getTopTracks = async () => {
            const artists = await getChartData('artists');
            const artistsNames = artists.slice(0, 3).map(a => a.name);
            let tracks = [];
            for (let i = 0; i < artistsNames.length; i++) {
                tracks.push(await getSearchData('track', artistsNames[i]));
            }
            return tracks;
        }

        const processTopTracks = async () => {
            const artistsTracks = await getTopTracks();
            const slicedArtistsTracks = artistsTracks.map(artistTracks => artistTracks.slice(0, 9));
            setTopTracks(slicedArtistsTracks);

            const [tr1, tr2, tr3] = slicedArtistsTracks;
            const newSongs = [...tr1, ...tr2, ...tr3];
            setSongs(newSongs);
        }

        const getMotivationTracks = async () => {
            const tracks = await getSearchData('track', 'motivational music');
            const slicedTracks = tracks.slice(0, 9);
            setMotivationList(slicedTracks);
        }

        const processGenres = async () => {
            const genres = await getGenres();
            const slicedGenres = genres.slice(1, 13);

            setGenres(slicedGenres)
        }

        processTopTracks();
        getMotivationTracks();
        processGenres();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current && audioRef.current.play();
        }
        else {
            audioRef.current && audioRef.current.pause();
        }
    }, [isPlaying, currentSong])

    // gsap hook
    useGSAP(() => {
        gsap.fromTo('#popular-tracks-h',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, delay: 1, duration: 1, ease: 'power2.out' });

        gsap.fromTo('#popular-tracks-div',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, delay: 1.5, duration: 1.5, ease: 'power2.out' });

        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollRef1.current,
                start: 'center bottom'
            }
        });
        tl.fromTo('#motivation-h',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 0.5 }, 1);
        const images = gsap.utils.toArray('.motivation-img');
        tl.fromTo(images,
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, stagger: 0.3 }, 2);

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: scrollRef2.current,
                start: 'center bottom'
            }
        })
        tl2.fromTo('#genre-h',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 0.5 }, 1);
        const genreImages = gsap.utils.toArray('.genre-img');
        tl2.fromTo(genreImages,
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, stagger: 0.3 }, 2);
        tl2.fromTo('.genre-title',
            { y: 20, opacity: 0, ease: 'power4.out' },
            { y: 0, opacity: 1, stagger: 0.3 }, 2.5);
    }, [motivationList, genres]);

    // handler functions
    const handleChange = (event) => {
        const { name, value } = event.target;

        setInputData(prevInput => ({
            ...prevInput,
            [name]: value
        }))
    }

    const handleFilterClick = () => {
        setFilterClicked(prev => !prev);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const getData = async () => {
            const data = await getSearchData(inputData.filter, inputData.search);
            console.log(data)
            setDataToDisplay(data);
        }
        getData();
    }

    const handleRefresh = () => {
        setDataToDisplay(null);
        setInputData({ filter: '', search: '' })
    }

    // audio functions
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
        const currSong = songs.find(s => s.id === trackId);
        setCurrentSong(currSong);
        setSelectedTrackId(trackId);
    }

    // list item loaders
    const loadArtistListItem = (data, index) => {
        return <Link to={`/artist/${data.id}`}>
            <ArtistListItem
                key={index}
                name={data.name}
                picture_medium={data.picture_medium}
            />
        </Link>
    }

    const loadAlbumListItem = (data, index) => {
        return <Link to={`/album/${data.id}`}>
            <AlbumListItem
                key={index}
                title={data.title}
                cover={data.cover_medium}
                artist={data.artist}
                />
        </Link>
    }

    const loadSongListItem = (data, index) => {
        return <SongListItem
            key={index}
            title={data.title}
            album={data.album}
            artist={data.artist}
            handleCurrentSong={() => setCurrentSong(data)}
        />
    }

    // search results loader
    const loadSearchResults = () => {
        if (dataToDisplay && dataToDisplay.every(singleData => singleData.type === 'artist')) {
            return (
                <section className='bg-black'>
                    <h1 className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text ml-[30%] md:ml-[11%]'>
                        Top search results
                    </h1>
                    <div className='min-h-[36rem] w-full md:grid grid-cols-2 justify-items-center flex flex-col justify-around items-center touch-pan-y'>
                        {dataToDisplay.slice(0, 14).map((singleData, i) => loadArtistListItem(singleData, i))}
                    </div>
                </section>)
        }
        else if (dataToDisplay && dataToDisplay.every(singleData => singleData.type === 'album')) {
            return (
                <section className='bg-black'>
                    <h1 className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text ml-[30%] md:ml-[11%]'>
                        Top search results
                    </h1>
                    <div className='min-h-[36rem] w-full md:grid grid-cols-2 justify-items-center flex flex-col justify-around items-center touch-pan-y'>
                        {dataToDisplay.slice(0, 14).map((singleData, i) => loadAlbumListItem(singleData, i))}
                    </div>
                </section>)
        }
        else if (dataToDisplay && dataToDisplay.every(singleData => singleData.type === 'track')) {
            return (
                <section className='bg-black'>
                    <h1 className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text ml-[30%] md:ml-[11%]'>
                        Top search results
                    </h1>
                    <div className='bg-black min-h-[36rem] w-full md:grid grid-cols-2 justify-items-center flex flex-col justify-around items-center touch-pan-y'>
                        {dataToDisplay.slice(0, 14).map((singleData, i) => loadSongListItem(singleData, i))}
                    </div>
                </section>)
        }
        else {
            return (
                <div className='bg-black min-h-[36rem] w-full md:grid grid-cols-2 justify-items-center flex flex-col justify-around items-center touch-pan-y'>
                    <h1 className='text-2xl md:text-4xl mb-10 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text ml-[30%] md:ml-[11%]'>
                        Top search results
                    </h1>
                    {dataToDisplay.slice(0, 14).map((singleData, i) => {
                        switch (singleData.type) {
                            case 'artist':
                                loadArtistListItem(singleData, i);
                                break;
                            case 'album':
                                loadAlbumListItem(singleData, i);
                                break;
                            case 'track':
                                loadSongListItem(singleData, i);
                                break;
                            default:
                                break;
                        }
                    })}
                </div>)
        }
    }

    // default page to render
    const defaultDisplay = <section>
        <section className='bg-black h-[30rem] md:h-[42rem] w-full flex flex-col justify-center md:justify-around items-center p-2 md:p-6'>
            <h1 id='popular-tracks-h' className='inline-block text-lg md:text-4xl mb-6 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 text-transparent bg-clip-text'>
                More tracks from your country's most popular artists
            </h1>
            <div id='popular-tracks-div' className='flex overflow-x-scroll snap-x snap-mandatory scroll-smooth touch-pan-x delay-75 w-[70%] lg:w-[50%]'>
                {topTracks && topTracks.map(artistTracks => (
                    <div className='flex-shrink-0 w-full grid grid-rows-3 grid-cols-3 gap-4 snap-center justify-items-center pb-8'>
                        {artistTracks.map(track => (
                            <img key={track.id} src={track.album.cover_medium} onClick={() => handleCurrentSong(track.id)}
                                className={`rounded-xl size-20 md:size-36 border-2 cursor-pointer 
                                    ${selectedTrackId === track.id ? 'border-white' : 'border-zinc-800'}`}
                            />))}
                    </div>
                ))}
            </div>
        </section>
        <section ref={scrollRef1} className='bg-black h-[32rem] md:h-[36rem] w-full flex flex-col justify-center items-center p-6'>
            <h1 id='motivation-h' className='text-2xl md:text-4xl mb-6 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text'>
                Some Motivational Soundtracks
            </h1>
            <div className='flex items-center overflow-x-scroll touch-pan-x w-full p-3 md:p-6'>
                {motivationList && motivationList.map((track, i) => (
                    <img key={i} src={track.album.cover_medium}
                        className='rounded-xl size-24 md:size-44 mx-8 motivation-img'
                    />
                ))}
            </div>
        </section>
        <section ref={scrollRef2} className='bg-black h-[32rem] md:h-[36rem] w-full flex flex-col justify-center items-center p-6'>
            <h1 id='genre-h' className='text-2xl md:text-4xl mb-6 bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text'>
                Genres
            </h1>
            <div className='flex items-center overflow-x-scroll touch-pan-x w-full min-h-[40%]'>
                {genres && genres.map((genre, i) => (
                    <section className='h-full min-w-24 md:min-w-44 mx-8 relative'>
                        <h2 className='text-xl md:text-2xl text-zinc-200 font-bold absolute left-4 top-4 z-10 genre-title'>
                            {genre.name}
                        </h2>
                        <img key={i} src={genre.picture_medium}
                            className='rounded-xl sixe-24 md:size-44 genre-img'
                        />
                    </section>
                ))}
            </div>
        </section>
    </section>

    return (
        <div>
            <Navbar />
            <main>
                <section className='bg-black h-32 w-full flex justify-center items-center p-2'>
                    <svg xmlns=' http://www.w3.org/2000/svg' fill=' none' viewBox=' 0 0 24 24' strokeWidth={1.5} stroke=' currentColor' className=' size-7 md:size-9 text-zinc-600 mr-4 cursor-pointer' onClick={handleRefresh}>
                        <path strokeLinecap=' round' strokeLinejoin=' round' d=' M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99' />
                    </svg>
                    <select name='filter' value={inputData.filter} onChange={handleChange}
                        className='h-[40%] w-[20%] md:w-[10%] xl:w-[5%] mr-4 bg-zinc-900 text-zinc-400 rounded-xl px-2' style={{ display: filterClicked ? 'inline-block' : 'none' }}
                        onBlur={handleFilterClick}
                    >
                        <option value=''>--Filter--</option>
                        <option value='artist'>Artist</option>
                        <option value='track'>Track</option>
                        <option value='album'>Album</option>
                    </select>
                    <svg xmlns=' http://www.w3.org/2000/svg' fill=' none' viewBox=' 0 0 24 24' strokeWidth={1.5} stroke=' currentColor' className=' size-7 md:size-9 text-zinc-600 mr-4 cursor-pointer' style={{ display: filterClicked ? 'none' : 'inline-block' }} onClick={handleFilterClick}>
                        <path strokeLinecap=' round' strokeLinejoin=' round' d=' M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z' />
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
                {dataToDisplay ? loadSearchResults() : defaultDisplay}
            </main>
            {currentSong && <audio src={currentSong.preview} ref={audioRef} onTimeUpdate={onPlaying} />}
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

export default Explore;