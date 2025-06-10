import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import createBubbles from "./createBubbles";

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const bubbles = createBubbles();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            document.cookie = `accessToken=${res.data.accessToken}; path=/; secure; samesite=lax`;
            document.cookie = `refreshToken=${res.data.refreshToken}; path=/; secure; samesite=lax`;
            document.cookie = `userId=${res.data.userId}`;
            
            confirm(res.data.message);
            navigate('/');
        }
        catch (error){
            console.error("There was an error submitting the form: ", error);
            alert("Error submitting form. Please try again.");
        }
    }

    return (
        <div className='min-h-[100vh] w-full flex justify-center bg-zinc-900 relative overflow-hidden'>
            <form className='form z-10' onSubmit={handleSubmit(onSubmit)}>
                <input className='form-input mb-0' type='text' placeholder='Username' {
                    ...register('username', {
                        required: 'Username required'
                    })
                }/>
                {errors.username && (
                    <div className='text-red-600 font-semibold px-2 text-center mt-0'>
                        {errors.username.message}
                    </div>
                )}

                <input className='form-input mb-0' type='password' placeholder='Password' {
                    ...register('password', {
                        required: 'Password required'
                    })
                }/>
                {errors.password && (
                    <div className='text-red-600 font-semibold px-2 text-center mt-0'>
                        {errors.password.message}
                    </div>
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

export default Login;