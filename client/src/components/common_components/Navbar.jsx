import { getCookie } from '../../utils/cookies';
import { Link } from 'react-router-dom';
import { logout, refreshToken } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';


const Navbar = () => {
    const [currentUser, setCurrentUser] = useState();
    const [userRole, setUserRole] = useState();

    useEffect(() => {
        try {
            setCurrentUser(getCookie('userId'));
            const acc = getCookie('accessToken');
            const decoded = acc ? jwtDecode(acc) : null;  
            decoded && setUserRole(decoded.role);    
        } catch (error) {
            console.error(error);
        }
    }, [])

    const navComponents = <div className='h-full mx-2 min-w-[60%] flex justify-evenly'>
        <ul className='max-md:hidden flex items-center'>
            <Link to='/'>
                <li className='text-zinc-400 mx-6 text-lg hover:text-white hover:scale-110'>
                    Home
                </li>
            </Link>
            <Link to='/explore'>
                <li className='text-zinc-400 mx-6 text-lg hover:text-white hover:scale-110'>
                    Explore
                </li>
            </Link>
            <Link to='/popular'>
                <li className='text-zinc-400 mx-6 text-lg hover:text-white hover:scale-110'>
                    Popular
                </li>
            </Link>
            {currentUser && <Link to='/library'>
                <li className='text-zinc-400 mx-6 text-lg hover:text-white hover:scale-110'>
                    Library
                </li>
            </Link>}
            {userRole === 'admin' && <Link to='/admin'>
                <li className='text-zinc-400 mx-6 text-lg hover:text-white hover:scale-110'>
                    Admin Panel
                </li>
            </Link>}
        </ul>
    </div>

    const loginRegister = <div className='flex items-center h-full w-1/5'>
        <Link to='/login' className='hidden md:inline-block h-3/5 w-full mr-1'>
            <button className='h-full w-full rounded-sm bg-transparent text-zinc-400 text-lg font-bold hover:bg-emerald-400 hover:text-white'>
                Login
            </button>
        </Link>
        <Link to='/register' className='hidden md:inline-block h-3/5 w-full mr-3'>
            <button className='h-full w-full rounded-sm bg-zinc-600 text-white text-lg hover:bg-blue-400'>
                Sign Up
            </button>        
        </Link>
        <Link to='/login' className='inline-block mr-3 md:hidden'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        </Link>
    </div>

    const logoutBtn = <div className='h-3/5 w-[12%] mr-3 flex items-center'>
        <div className='flex items-center justify-center h-11 w-11 text-white rounded-full 
            bg-gradient-to-br from-emerald-400 to-blue-400 md:hidden' onClick={logout}>
            W
        </div>
        <button className='hidden md:inline-block h-full w-full mr-3 rounded-sm bg-zinc-600 text-white text-lg
        hover:bg-emerald-400' onClick={logout}>
            Logout
        </button>
    </div>

    return (
        <header className='h-24 w-full bg-zinc-900'>
            <nav className='flex justify-between h-full w-full items-center'>
                <img src='whiplash_logo.png' className='rounded-md bg-transparent h-4/5 w-1/7' 
                    alt='WhiplashLogo'/> 
                {navComponents}
                {currentUser ? logoutBtn : loginRegister}
            </nav>
        </header>
    );
}

export default Navbar;