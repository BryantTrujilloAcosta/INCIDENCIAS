import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import AgregarUsuarios from "./views/AgregarUsuarios"
import LoginView from "./views/LoginView"

// Placeholder components
const AdminView = () => <div>Panel de Administración</div>
const AgregarEquipos = () => <div>Agregar Equipos</div>
const AgregarEdificios = () => <div>Agregar Edificios</div>
const AgregarEspacios = () => <div>Agregar Espacios</div>
const Incidencias = () => <div>Gestión de Incidencias</div>

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/auth/login' element={<LoginView />}/>

                <Route path='/admin' element={<AppLayout />}>
                    <Route index element={<AdminView />} />
                    <Route path='agregarUsuarios' element={<AgregarUsuarios />}/>
                    <Route path='agregarEquipos' element={<AgregarEquipos />}/>
                    <Route path='agregarEdificios' element={<AgregarEdificios />}/>
                    <Route path='agregarEspacios' element={<AgregarEspacios />}/>
                    <Route path='incidencias' element={<Incidencias />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}