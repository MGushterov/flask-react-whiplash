import gsap from 'gsap';
import Note from '../../assets/musical_note.png';
import Notes from '../../assets/musical_notes.png';
import { useGSAP } from '@gsap/react';

const Hero = () => {
    useGSAP(() => {
        gsap.to('#note', {
            y: '+=120', 
            rotation: 1080, 
            ease: 'sine.inOut', 
            duration: 3, 
            delay: 1.5
        });
        gsap.to('#notes', {
            y: '-=120', 
            rotation: 1080, 
            ease: 'sine.inOut', 
            duration: 3, 
            delay: 1.5
        });
        gsap.fromTo('#title', {
            opacity: 0,
            y: 20,
        }, {
            opacity: 1,
            y: 0,
            delay: 1.5,
            duration: 2.5,
            ease: 'power1.inOut',
        })
    }, [])

    return (
        <section className='px-3 py-3 bg-black flex items-center justify-between h-[30rem] w-full'>
            <img src={Note} id='note' className='size-16 md:size-32 bg-black'/>
            <h1 id='title' className='bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 inline-block text-transparent bg-clip-text text-6xl md:text-9xl opacity-0'>Whiplash</h1>
            <img src={Notes} id='notes' className='size-16 md:size-32 bg-black'/>
        </section>
    );
}

export default Hero;