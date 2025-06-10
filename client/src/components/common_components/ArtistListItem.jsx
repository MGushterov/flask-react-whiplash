const ArtistListItem = (props) => {
    const { name, picture_medium, position } = props;
    
    return (
        <section className='flex items-center mb-6'> 
            {position && <p className='text-zinc-600 text-xl md:text-2xl lg:text-3xl mr-2'>{`${position}.`}</p>}
            <img
                src={picture_medium}
                className='size-11 md:size-20 rounded-full mr-2 md:mr-6'
            />
            <div className='flex flex-col justify-center w-28 md:w-40 xl:w-48'>
                <h1 className='text-base md:text-xl text-zinc-300'>{name.length > 14 ? name.substring(0, 11) + '...' : name}</h1>
            </div>
        </section>
    );
}

export default ArtistListItem;