const SongListItem = (props) => {
    const { position, title, artist, album, handleCurrentSong } = props;
    
    return (
        <section className='flex items-center mb-6'> 
            {position && <p className='text-zinc-600 text-xl md:text-2xl lg:text-3xl mr-2'>{`${position}.`}</p>}
            <div className='h-full flex items-center cursor-pointer' onClick={handleCurrentSong}>
                <img
                    src={album['cover_medium']}
                    className='size-11 md:size-20 rounded-xl mr-2 md:mr-6'
                />
                <div className='flex flex-col justify-center w-28 md:w-40 xl:w-48'>
                    <h1 className='text-base md:text-xl text-zinc-300'>{title.length > 14 ? title.substring(0, 11) + '...' : title}</h1>
                    <h2 className='text-sm md:text-lg text-zinc-600 overflow-hidden'>{artist.name.length > 14 ? artist.name.substring(0, 11) + '...' : artist.name}</h2>
                </div>
            </div>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-7 md:size-12 text-zinc-600 self-center'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z' />
            </svg>
        </section>
    );
}

export default SongListItem;