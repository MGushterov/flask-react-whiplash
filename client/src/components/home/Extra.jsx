import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';

const Extra = () => {
    const scrollRef = useRef(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollRef.current,
                start: 'center bottom'
            }
        });
        for (let i = 1; i <= 3; i++) {
            tl.fromTo(`#container-${i}-image`,
                { y: 20, opacity: 0, ease: 'power2.out' },
                { y: 0, opacity: 1, duration: 0.5 });
            tl.fromTo(`#container-${i}-para`,
                { y: 20, opacity: 0, ease: 'power2.out' },
                { y: 0, opacity: 1, duration: 0.5 }, '>0.5');
            tl.fromTo(`#container-${i}-link`,
                { y: 20, opacity: 0, ease: 'power2.out' },
                { y: 0, opacity: 1, duration: 0.5 }, '<');
        }
    }, [])

    return (
        <section className='hidden bg-zinc-900 h-[28rem] w-full p-10 md:grid grid-rows-4 grid-cols-3 gap-3 grid-flow-col' ref={scrollRef}>
            {/* Extra Container 1 */}
            <div id='container-1-image' className='flex justify-center items-center'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-20 text-zinc-600'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z' />
                </svg>
            </div>
            <div id='container-1-para' className='grid-rows-subgrid row-span-2 flex flex-col justify-around items-center p-4'>
                <h3 className='text-zinc-500 text-2xl'>Don't have a profile yet?</h3>
                <p className='text-zinc-600 text-lg max-w-60'>Create an account today and get access to the full Whiplash experience</p>
            </div>
            <div id='container-1-link' className='flex justify-center items-start'>
                <Link to='/register'>
                    <p className='text-zinc-500 hover:text-zinc-400 underline text-lg'>Sign up</p>
                </Link>
            </div>
            {/* Extra container 2 */}
            <div id='container-2-image' className='flex justify-center items-center'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-20 text-zinc-600'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z' />
                </svg>
            </div>
            <div id='container-2-para' className='grid-rows-subgrid row-span-2 flex flex-col justify-around items-center p-4'>
                <h3 className='text-zinc-500 text-2xl'>Explore now</h3>
                <p className='text-zinc-600 text-lg max-w-60'>Explore the vast catalogue of songs and playlists the Whiplash app (with Deezer API) provides</p>
            </div>
            <div id='container-2-link' className='flex justify-center items-start'>
                <Link to='/explore'>
                    <p className='text-zinc-500 hover:text-zinc-400 underline text-lg'>Explore</p>
                </Link>
            </div>
            {/* Extra container 3 */}
            <div id='container-3-image' className='flex justify-center items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 text-zinc-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
            </div>
            <div id='container-3-para' className='grid-rows-subgrid row-span-2 flex flex-col justify-around items-center p-4'>
                <h3 className='text-zinc-500 text-2xl'>Get in the trend</h3>
                <p className='text-zinc-600 text-lg max-w-60'>Discover the latest trends in the music industry, we have everything to satisfy your taste</p>
            </div>
            <div id='container-3-link' className='flex justify-center items-start'>
                <Link to='/popular'>
                    <p className='text-zinc-500 hover:text-zinc-400 underline text-lg'>Discover what is popular</p>
                </Link>
            </div>
        </section>
    );
}

export default Extra;