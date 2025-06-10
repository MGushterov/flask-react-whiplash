import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import createBubbles from '../forms/createBubbles';
import { getCookie } from '../../utils/cookies';
import { useEffect, useState } from 'react';

const AddSongForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [accessToken, setAccessToken] = useState();

    const bubbles = createBubbles();
    const navigate = useNavigate();

    useEffect(() => {
        setAccessToken(getCookie('accessToken'));
    }, [])

    const onSubmit = async (formData) => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/add', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            confirm(res.data.message);
            navigate('/admin');
        } catch (error) {
            console.error('There was an error submitting the form: ', error);
            alert('Error submitting form. Please try again.');
        }
    }

    return (
        <div className='min-h-[100vh] w-full flex justify-center bg-zinc-900 relative overflow-hidden'>
            <form className='form z-10' onSubmit={handleSubmit(onSubmit)}>
                <input className='form-input' type='text' placeholder='Song ID' {
                    ...register('songId', { required: 'Song ID required' })
                } />

                {errors.songId && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.songId.message}</div>
                )}

                <input className='form-input' type='text' placeholder='Artist ID' {
                    ...register('artistId', { required: 'Artist ID required' })
                } />

                {errors.artistId && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.artistId.message}</div>
                )}

                <input className='form-input' type='text' placeholder='Song URL' {
                    ...register('songUrl', { required: 'Song URL required' })
                } />

                {errors.songUrl && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.songUrl.message}</div>
                )}

                <input className='form-input' type='text' placeholder='Song title' {
                    ...register('songTitle', { required: 'Song title required' })
                } />

                {errors.songTitle && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.songTitle.message}</div>
                )}

                <button className='form-submit-button' disabled={isSubmitting}>
                    {isSubmitting ? 'Loading...' : 'Submit'}
                </button>
            </form>
            <div className='absolute inset-0 z-0 bubble-container max-md:hidden'>
                {bubbles}
            </div>
        </div>
    );
}

export default AddSongForm;