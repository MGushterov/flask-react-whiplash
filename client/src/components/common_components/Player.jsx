import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SongListItem from './SongListItem';

const Player = ({ currentSong, setCurrentSong, audioRef, isPlaying, setIsPlaying, songs, setSelectedTrackId, albumData }) => {
    const [title, setTitle] = useState();
    const [playerIsLarge, setPlayerIsLarge] = useState(false);
    const [list, setList] = useState(songs);
    const [songRepeat, setSongRepeat] = useState(false);
    const [upNextDisplay, setUpNextDisplay] = useState(false);
    const clickRef = useRef();

    useEffect(() => {
        if (currentSong) {
            setSelectedTrackId(currentSong.id);
            if (currentSong.title) {
                setTitle(currentSong.title)
            }
            else if (currentSong.songTitle) {
                setTitle(currentSong.songTitle)
            }
            else {
                alert('error')
            }
        }

        if (currentSong.progress === 100) {
            if (songRepeat) {
                currentSong.progress = 0;
                setSongRepeat(prev => !prev)
            }
            else {
                skipForward();
            }
        }
    }, [currentSong]);

    useGSAP(() => {
        gsap.fromTo('#up-next', {
            x: 40,
            display: 'hidden'
        }, {
            x: 0,
            display: 'block',
            ease: 'power2.out',
            duration: 0.8
        });

        gsap.fromTo('#large-main', {
            y: -20, 
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out'
        })
    }, [upNextDisplay, playerIsLarge])

    const checkWidth = (event) => {
        let width = clickRef.current.clientWidth;
        const offset = event.nativeEvent.offsetX;

        const divprogress = offset / width * 100;
        audioRef.current.currentTime = divprogress / 100 * currentSong.length;
    }

    const playPause = () => {
        setIsPlaying(prevIsPlaying => !prevIsPlaying);
    }


    const skipBack = () => {
        const index = songs.findIndex(song => song.id === currentSong.id);
        if (index > 0) {
            setCurrentSong(songs[index - 1]);
        }
        audioRef.current.currentTime = 0;
    }

    const skipForward = () => {
        const index = songs.findIndex(song => song.id === currentSong.id);
        if (index === (songs.length - 1)) {
            setCurrentSong(songs[0])
            console.log(currentSong)
        }
        else {
            setCurrentSong(songs[index + 1])
            console.log(currentSong)
        }
        audioRef.current.currentTime = 0;
    }

    const loadSongListItem = (data, index) => {
        return <SongListItem
            key={index}
            title={data.title ? data.title : data.songTitle}
            album={data.album}
            artist={data.artist}
            handleCurrentSong={() => setCurrentSong(data)}
        />
    }

    const handleUpNextDisplay = () => {
        const currSongIndex = songs.findIndex(song => song.id === currentSong.id);
        const list = songs.slice(currSongIndex + 1).map((singleData, i) => singleData.album && loadSongListItem(singleData, i));

        return (
            <div className='h-full w-full'>
                <div className='w-full bg-zinc-900 p-4 rounded-xl'>
                    <h1 className='text-4xl text-zinc-200'>Up next</h1>
                </div>
                <div className={'mt-6 overflow-scroll ' + (upNextDisplay && 'max-sm:flex max-sm:flex-col max-sm:items-center')}>
                    {list}
                </div>
            </div>
        );
    }

    const smallPlayer = <section className='flex flex-col p-4 justify-around h-16 w-full bg-zinc-900 fixed bottom-14 md:bottom-0 z-50' id='small'>
        <div className='flex items-center justify-between'>
            <div className='h-full w-[80%] flex' onClick={() => setPlayerIsLarge(prev => !prev)}>
                {currentSong.album ? <img src={currentSong.album['cover_medium']} className='rounded-xl size-11 mr-2' /> : <img src={albumData['cover_medium']} className='rounded-xl size-11 mr-2' />}
                <div className='flex flex-col justify-center'>
                    <h1 className='text-zinc-300'>{title && (title.length > 14 ? title.substring(0, 11) + '...' : title)}</h1>
                    <h2 className='text-zinc-600'>{currentSong.artist.name}</h2>
                </div>
            </div>
            <div className='h-full flex items-center'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-9 text-zinc-400 mr-3 cursor-pointer'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z' />
                </svg>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-9 text-zinc-400 mr-3 cursor-pointer' onClick={skipBack}>
                    <path d='M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z' />
                </svg>
                {isPlaying
                    ? <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-9 text-zinc-400 mr-3 cursor-pointer' onClick={playPause}>
                        <path fillRule='evenodd' d='M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z' clipRule='evenodd' />
                    </svg>
                    : <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-9 text-zinc-400 mr-3 cursor-pointer' onClick={playPause}>
                        <path fillRule='evenodd' d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' clipRule='evenodd' />
                    </svg>
                }
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-9 text-zinc-400 mr-3 cursor-pointer' onClick={skipForward}>
                    <path d='M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z' />
                </svg>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-9 text-zinc-400 cursor-pointer' onClick={() => setSongRepeat(prev => !prev)}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3' />
                    {songRepeat && <text
                        x='12' y='14'
                        textAnchor='middle'
                        fontSize='8'
                        className='text-zinc-200'
                    >
                        1
                    </text>}
                </svg>
            </div>
        </div>
        <div>
            <div className='w-full h-[5px] rounded-[30px] cursor-pointer bg-zinc-800' onClick={checkWidth} ref={clickRef}>
                <div className='w-0 h-full bg-emerald-500 rounded-[30px]' style={{ width: `${currentSong.progress + '%'}` }}></div>
            </div>
        </div>
    </section>

    const largePlayer = <section className='flex flex-col p-4 pt-8 justify-around h-[100vh] w-full bg-black fixed bottom-14 md:bottom-0 z-50' id='large'>
        <div className='flex justify-between items-center h-[15%] md:h-[5%] w-full md:px-5 lg:px-28'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-10 text-zinc-600 cursor-pointer' onClick={() => setPlayerIsLarge(prev => !prev)}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
            </svg>
            {/* {!upNextDisplay && <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-10 text-zinc-600 self-center cursor-pointer'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z' />
            </svg>} */}
        </div>
        <section className='flex max-sm:flex-col-reverse justify-around h-[95%] w-full' id='large-main'>
            <div className='h-full w-full md:flex flex-col justify-around'>
                <div className={'flex flex-col items-center mb-5 h-[70%] ' + (upNextDisplay && 'h-[80%]')}>
                    {currentSong.album ? <img src={currentSong.album['cover_big']} className='rounded-xl size-96 mb-4' /> : <img src={albumData['cover_big']} className='rounded-xl size-96 mb-4' />}
                    <div className='flex flex-col justify-center mr-[180px]'>
                        <h1 className='text-zinc-300 text-3xl'>{title}</h1>
                        <h2 className='text-zinc-600 text-2xl'>{currentSong.artist.name}</h2>
                    </div>
                </div>
                <div className={'h-[15%] flex flex-col items-center justify-center md:px-48 '}>
                    <div className='w-[80%] h-[8%] rounded-[30px] cursor-pointer bg-zinc-800' onClick={checkWidth} ref={clickRef}>
                        <div className='w-0 h-full bg-emerald-500 rounded-[30px]' style={{ width: `${currentSong.progress + '%'}` }}></div>
                    </div>
                    <div className='h-[92%] w-full flex items-center justify-around'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-12 text-zinc-200 cursor-pointer'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z' />
                        </svg>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-12 text-zinc-200 cursor-pointer' onClick={skipBack}>
                            <path d='M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z' />
                        </svg>
                        {isPlaying
                            ? <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-12 text-zinc-200 cursor-pointer' onClick={playPause}>
                                <path fillRule='evenodd' d='M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z' clipRule='evenodd' />
                            </svg>
                            : <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-12 text-zinc-200 cursor-pointer' onClick={playPause}>
                                <path fillRule='evenodd' d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' clipRule='evenodd' />
                            </svg>
                        }
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-12 text-zinc-200 cursor-pointer' onClick={skipForward}>
                            <path d='M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z' />
                        </svg>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-12 text-zinc-200 cursor-pointer' onClick={() => setSongRepeat(prev => !prev)}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3' />
                            {songRepeat && <text
                                x='12' y='14'
                                textAnchor='middle'
                                fontSize='8'
                                className='text-zinc-200'
                            >
                                1
                            </text>}
                        </svg>
                    </div>
                </div>
                <div className={'w-full flex justify-around items-center ' + (upNextDisplay ? 'h-[20%]' : 'h-[10%]')}>
                    <div className='h-[80%] w-36 rounded-3xl bg-zinc-900 flex items-center justify-center cursor-pointer hover:bg-zinc-800' onClick={() => setUpNextDisplay(prev => !prev)}>
                        <h3 className='text-2xl text-zinc-200'>Up next</h3>
                    </div>
                </div>
            </div>
            {upNextDisplay && <div className='h-full w-full md:w-[30%]' id='up-next'>
                {handleUpNextDisplay()}
            </div>}
        </section>
    </section>

    return (
        playerIsLarge ? largePlayer : smallPlayer
    );
}

export default Player;