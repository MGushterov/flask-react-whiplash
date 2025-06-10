import { Link } from "react-router-dom";


const AdminPanel = () => {
    return (
        <main className='min-h-[100vh] w-full flex justify-around items-center bg-zinc-900 relative overflow-hidden'>
            <Link to='/admin/add'>
                <section className='form min-h-44 min-w-44 shadow-lg shadow-zinc-400 hover:shadow-xl hover:shadow-zinc-200 text-center'>
                    <h1 className='text-zinc-300 text-3xl'>Add New Song</h1>
                </section> 
            </Link>
            <Link to='/admin/delete'>
                <section className='form min-h-44 min-w-44 shadow-lg shadow-zinc-400 hover:shadow-xl hover:shadow-zinc-200 text-center'>
                    <h1 className='text-zinc-300 text-3xl'>Delete Song</h1>
                </section>  
            </Link>
        </main>
    );
}

export default AdminPanel;