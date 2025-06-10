import Footer from '../common_components/Footer';
import Navbar from '../common_components/Navbar';
import Carousel from './Carousel';
import Extra from './Extra';
import Hero from './Hero';
import Join from './Join';


const Home = () => {
    return (
        <div className='min-h-screen'>
            <Navbar/>
            <main>
                <Hero/>
                <Carousel />
                <Join />
                <Extra />
            </main>
            <Footer/>
        </div>
    );
}

export default Home;