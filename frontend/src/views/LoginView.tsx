import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "sonner";
import ErrorMessage from '../components/ErrorMessage';
import api from '../config/axios';
import type { LoginForm } from '../types';
    export default function LoginView() {
        const navigate = useNavigate()
        const initialValues : LoginForm = {
            email: '',
            password: '',
        } 

        const {register,handleSubmit,formState:{errors}} = useForm({defaultValues: initialValues})

        const handleLogin = async (formData : LoginForm) => {
            try{
                const {data} = await api.post(`/auth/login`,formData)
                console.log('Token recibido:', data)
                localStorage.setItem('AUTH_TOKEN',data)
                console.log('Token guardado:', localStorage.getItem('AUTH_TOKEN'))
                navigate('/admin')
            }catch(error){
                if(isAxiosError(error) && error.response){
                    console.error('Error en login:', error.response?.data)
                    toast.error(error.response?.data.error)
                }
            }
        }
        return (
            <>
                <div className='min-h-screen w-full bg-[rgb(27,57,106)] flex items-center justify-center '>
                    <div className='bg-white max-w-2xl mx-auto my-10 p-10 rounded-lg shadow-md '>
                        <div className='max-w-lg mx-auto pt-10 px-10'>
                            <img src='/logo2.svg' alt='logotipo' />
                        </div>
                        <div className='text-xl text-center'>
                            <h1 className="mt-4">Sistema de incidencias</h1>
                            <h2 className='text-xl font-bold'>Iniciar Sesión</h2>
                            <p className='text-gray-600'>Por favor ingresa tus credenciales</p>
                        </div>
                        <form 
                            onSubmit={handleSubmit(handleLogin)} 
                            className='text-xl'
                            noValidate
                        >
                        <div className='mb-4 pt-10 '>
                            <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>
                                correo electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder='Ingresa tu correo electrónico'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                {...register('email',{
                                    required:"El email es obligatorio",
                                    pattern:{
                                        value:/\S+@\S+\.\S+/,
                                        message:"El email no es válido"
                                    }
                                })}
                            />
                        </div>
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                        <div className='mb-6'>
                            <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder='Ingresa tu contraseña'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                {...register('password',{
                                    required:"La contraseña es obligatoria",
                                    minLength:{
                                        value:6,
                                        message:"La contraseña debe tener al menos 6 caracteres"
                                    }
                                })}
                            />
                        </div>
                            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                        <button
                            type="submit"
                            className='w-full bg-[rgb(27,57,106)] text-white font-bold py-3 px-4 mt-1 rounded-md hover:bg-blue-600 transition-colors duration-300'
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                    </div>
                </div>
                <Toaster position='top-right' />
            </>
        )
    }