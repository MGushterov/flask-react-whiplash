import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const createBubbles = () => {
    const bubbles = Array.from({ length: 20 }).map((_, i) => (
        <div 
            key={i}
            id={`bubble_${i}`}
            className='rounded-full h-20 w-20 absolute'>
        </div>
    ));

    useGSAP(() => {
        bubbles.forEach((_, i) => {
            gsap.fromTo(`#bubble_${i}`, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                background: 'linear-gradient(to right, #34d399, #3b82f6)'
            }, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                duration: 20,
                background: 'linear-gradient(to right, #059669, #bfdbfe)' 
            })
        })
    }, [])

    return bubbles;
}

export default createBubbles;