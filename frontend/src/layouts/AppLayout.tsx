import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../api/IncidenciaApi';
import VerticalMenu from '../components/VerticalMenu';

export default function AppLayout() {
    const {data, isLoading, isError} = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 1,
        refetchOnWindowFocus: false
    })

    if(isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )

    if(isError) return <Navigate to='/auth/login'/>

    if(!data) return null

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='relative mx-auto bg-[rgb(27,57,106)] w-full flex items-center justify-between'>
                <div className='flex items-center ml-10'>
                    <img className='w-36' src='/logo_3.png' alt='logotipo'/>
                </div>
                <div className='flex items-end justify-between right-5'>
                    <p className='text-lg text-white uppercase'>{data.rol}</p>
                </div>
                <p className='text-3xl text-white mr-10'>{data.name}</p>
            </div>
            <VerticalMenu />
            <div className="ml-60 p-8">
                <Outlet />
            </div>
        </div>
    )
}