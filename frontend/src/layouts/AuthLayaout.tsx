import { Link } from 'react-router-dom';
export default function AuthLayout(){
    return (
        <>
            <div className='min-h-screen bg-gray-50' >
                <div className=' mx-auto  bg-[rgb(27,57,106)] w-full flex items-center place-content-between  '>
                    <div className='flex items-center gap-3'>
                    <button className='text-white text-2xl font-bold ml-5'> =</button>
                    <img className='w-36 ml-5 ' src='/logo_3.png' alt='logotipo' />
                    </div>
                    <div className="flex items-center gap-6 mr-5">
                    <h1 className='text-3xl text-white'>Panel de Administración</h1>
                    <Link className="text-xl text-white " to="/auth/ogin">cerrar sesión</Link>
                    </div>
                </div>
            </div>
        </>
    )
}