import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import createBubbles from './createBubbles';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const watchIsAdmin = watch('isAdmin', false);

    const bubbles = createBubbles();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/register', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            confirm(res.data.message);
            navigate('/login');
        } catch (error) {
            console.error('There was an error submitting the form: ', error);
            alert('Error submitting form. Please try again.');
        }
    }

    return (
        <div className='min-h-[100vh] w-full flex justify-center bg-zinc-900 relative overflow-hidden'>
            <form className='form z-10' onSubmit={handleSubmit(onSubmit)}>
                <input className='form-input' type='text' placeholder='Username' {
                    ...register('username', {
                    required: 'Username required', 
                    minLength: {
                        value: 3,
                        message: 'Username length must be greater than 3'
                    }, 
                    maxLength: {
                        value: 16,
                        message: 'Username length must be less than 17'
                    }, 
                    pattern: /[A-Za-z0-9]+/
                })}/>
                {errors.username && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.username.message}</div>
                )}
                <input className='form-input' type='text' placeholder='Email' {
                    ...register('email', { 
                    required: 'Email required',
                    maxLength: {
                        value: 64,
                        message: 'Email length must be less than 65'
                    }, 
                    pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Invalid email format'
                    }
                })}/>
                {errors.email && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.email.message}</div>
                )}
                <input className='form-input' type='password' placeholder='Password' 
                    {...register('password', {
                    required: 'Requirements: one capital letter, one lower case letter, one digit, one special symbol',
                    minLength: {
                        value: 8,
                        message: 'Password length must be greater than 7'
                    },
                    maxLength: {
                        value: 16,
                        message: 'Password length must be less than 17'
                    },
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                        message: 'Invalid password format'
                    },
                })}/>
                {errors.password && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.password.message}</div>
                )}
                <div className='flex justify-center'>
                    <label for='#isAdmin' className='text-emerald-400 text-xl mr-4 font-mono'>Admin</label>
                    <input {...register('isAdmin')} type='checkbox' value='isAdmin' id='isAdmin' className='accent-emerald-400'/>
                </div>
                {watchIsAdmin && <input 
                    className='form-input'          
                    type='text' 
                    placeholder='Admin Code' 
                    {...register('adminCode')}
                />}

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

export default Register;