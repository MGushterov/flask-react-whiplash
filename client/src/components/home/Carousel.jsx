import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState, useEffect, useRef } from 'react';
import { getChartData } from '../../utils/deezerCalls';
import WhiplashImage from '/whiplash_logo.png';

const Carousel = () => {
    const [popularSongsImages, setPopularSongsImages] = useState([]);
    const [popularArtistsImages, setPopularArtistsImages] = useState([]);
    const [popularPlaylistsImages, setPopularPlaylistsImages] = useState([]);

    const container1Ref = useRef(null);
    const container2Ref = useRef(null);
    const container3Ref = useRef(null);
    const container4Ref = useRef(null);

    useEffect(() => {
        const handlePopularSongsImages = async () => {
            const data = await getChartData('tracks');
            const slicedData = data.slice(0, 3);
            const imagesForCarousel = slicedData.map(d => d.album['cover_medium']);
            setPopularSongsImages(imagesForCarousel);
        }

        const handlePopularArtists = async () => {
            const artists = await getChartData('artists');
            const slicedData = artists.slice(0, 6);
            const imagesForCarousel = slicedData.map(d => d['picture_medium']);
            setPopularArtistsImages(imagesForCarousel); 
        }

        const handlePopularPlaylists = async () => {
            const playlists = await getChartData('playlists');
            const slicedData = playlists.slice(0, 5);
            const imagesForCarousel = slicedData.map(d => d['picture_medium'])
            setPopularPlaylistsImages(imagesForCarousel);
        }

        handlePopularSongsImages();
        handlePopularArtists();
        handlePopularPlaylists();
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({repeat: -1});
        for(let i = 1; i <= 4; i++) {
            tl.to(`#li_${i}`, {
                width: 35, 
                duration: 3, 
                background: 'white',
                onStart: () => {
                    for(let j = 1; j <= 4; j++) {
                        if(j === i) {
                            switch (j) {
                                case 1:
                                    gsap.to(container1Ref.current, 
                                        {display: 'block', ease: 'power2.inOut', opacity: 1, delay: 0.5, x: 0});
                                    break;
                                case 2:
                                    gsap.to(container2Ref.current, 
                                        {display: 'grid', ease: 'power2.inOut', opacity: 1, delay: 0.5, x: 0});
                                    break;
                                case 3:
                                    gsap.to(container3Ref.current, 
                                        {display: 'block', ease: 'power2.inOut', opacity: 1, delay: 0.5, x: 0});
                                    break;
                                case 4:
                                    gsap.to(container4Ref.current, 
                                        {display: 'flex', ease: 'power2.inOut', opacity: 1, delay: 0.5, x: 0});
                                    break;    
                                default:
                                    break;
                            }
                        }
                        else {
                            switch (j) {
                                case 1:
                                    gsap.to(container1Ref.current, 
                                        {display: 'none', opacity: 0, x: 50});
                                    break;
                                case 2:
                                    gsap.to(container2Ref.current, 
                                        {display: 'none' , opacity: 0, x: 50});
                                    break;
                                case 3:
                                    gsap.to(container3Ref.current, 
                                        {display: 'none', opacity: 0, x: 50});
                                    break;  
                                case 4:
                                    gsap.to(container4Ref.current, 
                                        {display: 'none', opacity: 0, x: 50});         
                                default:
                                    break;
                            }
                        }
                    }
                }
            });
            tl.to(`#li_${i}`, {width: 10, duration: 3})
        }
    }, [])

    return (
        <section className='bg-zinc-900 w-full h-[34rem] flex flex-col justify-center items-center max-sm:p-10 m-0'>
            <div className='bg-black w-full h-[90%] md:w-[60%] md:h-[80%] rounded-xl p-3'>
                {/* Container 1 */}
                <div ref={container1Ref} className='h-full w-full relative'>
                    <img src={popularSongsImages[0]} className='rounded-xl size-56 absolute top-2 left-5 lg:left-32'/>
                    <img src={popularSongsImages[1]} className='rounded-xl size-56 absolute bottom-12 left-32 max-sm:left-9 lg:left-72 z-10'/>
                    <img src={popularSongsImages[2]} className='rounded-xl size-56 absolute top-11 right-7 lg:right-52 max-sm:hidden'/>
                    <p className='text-zinc-200 z-20 absolute text-[1.5rem] font-semibold max-sm:left-1 bottom-2 md:right-4'>
                        Discover the latest hits
                    </p>
                </div>
                {/* Container 2 */}
                <div ref={container2Ref} className='h-full w-full grid grid-rows-2 grid-cols-3 gap-2 relative'>
                    {popularArtistsImages.map((image, i) => (
                        <img src={image} className='size-28 md:size-48 rounded-xl xl:mx-12' key={i}/>
                    ))}
                    <p className='text-zinc-200 absolute z-20 text-[1.5rem] font-semibold max-sm:left-1 bottom-2 md:right-4'>
                        Listen to your favorite artists
                    </p>
                </div>
                {/* Container 3 */}
                <div ref={container3Ref} className='h-full w-full flex flex-col justify-around md:relative'>
                    <p className='text-zinc-200 md:absolute z-40 text-[1.5rem] font-semibold max-sm:left-1 top-2 md:left-4'>
                        Find playlists that catch your eye
                    </p>
                    <div className='h-3/5 flex justify-around items-center md:relative top-16 lg:top-6'>
                        <img src={popularPlaylistsImages[0]} className='size-24 md:size-48 xl:size-60 rounded-xl md:absolute top-20 md:left-10 lg:left-20 xl:left-44 z-0'/>
                        <img src={popularPlaylistsImages[1]} className='size-24 md:size-48 xl:size-60 rounded-xl md:absolute top-20 md:left-20 lg:left-32 xl:left-56 z-10'/>
                        <img src={popularPlaylistsImages[2]} className='size-24 md:size-48 xl:size-60 rounded-xl md:absolute top-20 md:left-32 lg:left-48 xl:left-72 z-20'/>
                        <img src={popularPlaylistsImages[3]} className='max-sm:hidden md:size-48 xl:size-60 rounded-xl md:absolute top-20 md:right-20 lg:right-48 xl:right-72 z-30'/>
                        <img src={popularPlaylistsImages[4]} className='max-sm:hidden md:size-48 xl:size-60 rounded-xl md:absolute top-20 md:right-10 lg:right-24 xl:right-52 z-40'/>
                    </div>
                    <p className='text-zinc-200 md:absolute z-40 text-[1.5rem] font-semibold max-sm:right-1 bottom-2 md:right-4'>
                        Or create your own
                    </p>
                </div>
                {/* Container 4 */}
                <div ref={container4Ref} className='h-full w-full flex flex-col justify-center items-center'>
                    <img src={WhiplashImage} className='h-4/5 w-auto'/>
                    <h2 className='left-[22.5rem] text-zinc-200 text-[2.5rem] font-semibold'>
                        Sign up now
                    </h2>
                </div>
            </div>
            <div className='bg-zinc-600 w-40 h-7 rounded-3xl mt-5 flex justify-center items-center'>
                <ul className='flex justify-around items-center'>
                    <li className='size-2.5 rounded-full bg-zinc-400 mx-3' id='li_1'></li>
                    <li className='size-2.5 rounded-full bg-zinc-400 mx-3' id='li_2'></li>
                    <li className='size-2.5 rounded-full bg-zinc-400 mx-3' id='li_3'></li>
                    <li className='size-2.5 rounded-full bg-zinc-400 mx-3' id='li_4'></li>
                </ul>
            </div>
        </section>
    );
}

export default Carousel;