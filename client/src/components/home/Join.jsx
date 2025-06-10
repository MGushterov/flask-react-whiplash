import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState, useEffect, useRef } from 'react';
import { getTotalAmountOfTracks } from '../../utils/dbCalls';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/all';


const Join = () => {
    const [tracksCount, setTracksCount] = useState(0);

    const scrollRef = useRef();

    useEffect(() => {
        const getTracksCount = async () => {
            const count = await getTotalAmountOfTracks();
            setTracksCount(count);
        }

        getTracksCount();
    }, [])

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollRef.current,
                start: 'bottom-=20% bottom'
            }
        });

        const signUpH = new SplitType('#sign-up-h');
        tl.from(signUpH.chars, { y: 50, opacity: 0, stagger: 0.1, ease: 'power2.inOut', scale: 5 });
        tl.to(signUpH.chars, { y: 0, opacity: 1 });

        tl.fromTo('#whiplash-h',
            { y: 20, opacity: 0, duration: 0.5, ease: 'power4.out' },
            { y: 0, opacity: 1, ease: 'power2.inOut' });

        const CommH = new SplitType('#community-h');
        tl.from(CommH.chars, { y: 50, opacity: 0, stagger: 0.1, ease: 'power2.inOut' });
        tl.to(CommH.chars, { y: 0, opacity: 1 }, 2);

        tl.fromTo('#enjoy-h',
            { y: 20, opacity: 0, ease: 'power2.out' },
            { y: 0, opacity: 1, duration: 3 }, 4);

        // tl.from('#tracks-h', {
        //     innerText: 0,
        //     duration: 4,
        //     snap: { innerText: 1 },
        //     color: 'transparent'
        // }, 4);
    }, [])

    return (
        <section className='bg-black h-[28rem] lg:h-[32rem] w-full px-4 py-16 flex justify-center' id='join' ref={scrollRef}>
            <div className='flex flex-col w-[50%]'>
                <h2 className='text-zinc-500 max-sm:text-xl text-4xl' id='sign-up-h'>
                    Sign up today and join the
                </h2>
                <h1 className='bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block
                text-transparent bg-clip-text max-sm:text-4xl md:text-[5rem] lg:text-[6rem] xl:text-[10rem]' id='whiplash-h'>
                    Whiplash
                </h1>
                <h2 className='text-zinc-500 max-sm:text-xl text-4xl self-end' id='community-h'>
                    community
                </h2>
            </div>
            <div className='flex flex-col items-center w-[50%]'>
                <h3 className='text-zinc-500 max-sm:text-lg text-2xl' id='enjoy-h'>
                    Enjoy the full versions of
                </h3>
                <h1 className='bg-gradient-to-br from-zinc-900 via-emerald-800 to-green-500 inline-block
                text-transparent bg-clip-text max-sm:text-4xl md:text-[5rem] lg:text-[6rem] xl:text-[10rem]' id='tracks-h'>
                    {tracksCount}
                </h1>
                <h2 className='text-zinc-500 max-sm:text-xl text-4xl' id='songs-h'>
                    songs
                </h2>
            </div>
        </section>
    );
}

export default Join;