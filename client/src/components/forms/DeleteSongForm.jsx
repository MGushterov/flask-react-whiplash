import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import createBubbles from '../forms/createBubbles';
import axiosInstance from '../../utils/axiosInstance';

const DeleteSongForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const bubbles = createBubbles();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            const { data } = await axiosInstance.delete(`http://127.0.0.1:5000/delete/${formData.songId}`);
            confirm(data.message);
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

export default DeleteSongForm;