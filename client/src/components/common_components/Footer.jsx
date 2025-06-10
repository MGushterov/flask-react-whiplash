import { Link, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/cookies';

const Footer = () => {
    const currentUser = getCookie('userId');
    const location = useLocation();

    return (
        <footer className='inline-block h-14 w-full p-4 max-sm:fixed bottom-0 bg-zinc-900 z-50'>
            <ul className='flex items-center justify-evenly md:hidden'>
                <Link to='/'>
                    <li className='mx-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/' ? 'white' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </li>
                </Link>
                <Link to='/explore'>
                    <li className='mx-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/explore' ? 'white' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                        </svg>
                    </li>
                </Link>
                <Link to='/popular'>
                    <li className='mx-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/popular' ? 'white' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                        </svg>
                    </li>
                </Link>
                {currentUser && <Link to='/library'>
                    <li className='mx-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/library' ? 'white' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                        </svg>
                    </li>
                </Link>}
            </ul>
            <h3 className='text-zinc-500 text-sm relative top-1 left-2 max-sm:hidden'>
                Whiplash (with DEEZER API)
            </h3>
        </footer>
    );
}

export default Footer;