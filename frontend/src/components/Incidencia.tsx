import type { User } from '../types';
import VerticalMenu from './VerticalMenu';

type IncidenciaProps={
        data: User
}
export default function Incidencia({data}:IncidenciaProps) {
    return (
        <>
        <div className='min-h-full-screen bg-gray-50'>
                <div className='relative mx-auto bg-[rgb(27,57,106)] w-full flex items-center justify-between '>
                    <div className='flex items-center ml-10 '>
                        <img className='w-36' src='/logo_3.png' alt='logotipo'/>
                    </div>
                    <div className='flex  items-end justify-between right-5'>
                        <p className='text-lg text-white uppercase'>{data.rol}</p>
                    </div>
                        <p className='text-3xl text-white mr-10'>{data.name}</p>
                </div>
                <VerticalMenu/>
        </div>
        </>
    )
}