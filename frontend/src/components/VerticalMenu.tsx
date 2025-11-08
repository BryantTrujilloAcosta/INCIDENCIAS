import { ArrowLeftEndOnRectangleIcon, BuildingOfficeIcon, ComputerDesktopIcon, HomeModernIcon, TicketIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { Link } from "react-router-dom"
export default function VerticalMenu() {
    return (
        <>
        <div className='h-full bg-[rgb(27,57,106)] inline-block w-60  pt-6 absolute  '>
            <div className='block p-4 justify-between h-full '>
                <div className='flex items-center justify-center mt-10'>
                    <Link to='/admin/agregarUsuarios' className='flex items-center text-white space-x-2'>
                        <UserPlusIcon className='w-6 h-6' />
                        <span>Agregar Usuario</span>
                    </Link>
                </div>
                <div className='flex items-center justify-center mt-10'>
                    <Link to='/admin/agregarEquipos' className='flex items-center text-white space-x-2'>
                        <ComputerDesktopIcon className='w-6 h-6' />
                        <span>Agregar Equipo</span>
                    </Link>
                </div>
                <div className='flex items-center justify-center mt-10'>
                    <Link to='/admin/agregarEdificios' className='flex items-center text-white space-x-2'>
                        <BuildingOfficeIcon className='w-6 h-6' />
                        <span>Agregar Edificio</span>
                    </Link>
                </div>
                <div className='flex items-center justify-center mt-10'>
                    <Link to='/admin/agregarEspacios' className='flex items-center text-white space-x-2'>
                        <HomeModernIcon className='w-6 h-6' />
                        <span>Agregar Espacio</span>
                    </Link>
                </div>
                <div className='flex items-center justify-center mt-10'>
                    <Link to='/admin/incidencias' className='flex items-center text-white space-x-2'>
                        <TicketIcon className='w-6 h-6' />
                        <span>Incidencias</span>
                    </Link>
                </div>
                <div className='flex items-center justify-center mt-10'>
                    <Link to='/auth/login' className='flex items-center text-white space-x-2'>
                        <ArrowLeftEndOnRectangleIcon className='w-6 h-6' />
                        <span>Cerrar sesion</span>
                    </Link>
                </div>
            </div>

        </div>
        </>
    )
}

