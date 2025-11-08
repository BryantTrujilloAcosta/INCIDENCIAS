
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast, Toaster } from "sonner"
import ErrorMessage from "../components/ErrorMessage"
import api from "../config/axios"
import type { RegisterForm, User } from "../types"

// Usamos el tipo centralizado RegisterForm (sin handle) y con campo 'rol' para coincidir con backend
const initialValues: RegisterForm & { password: string } = {
    name: '',
    email: '',
    password: '',
    rol: 'TECNICO',
    department: ''
}

export default function AgregarUsuarios() {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<RegisterForm & { password: string }>({
        defaultValues: initialValues
    })

    const selectedRole = watch('rol')

    // Tabla de usuarios (excluye ADMIN desde backend)
    type UserRow = Omit<User, 'password'>
    const [users, setUsers] = useState<UserRow[]>([])
    const [loading, setLoading] = useState(false)
    const [savingId, setSavingId] = useState<string | null>(null)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data } = await api.get<UserRow[]>('/users')
            setUsers(data)
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Error al cargar usuarios')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async (data: RegisterForm & { password: string }) => {
        try {
            await api.post('/auth/register', data)
            toast.success('Usuario creado exitosamente')
            reset(initialValues)
            fetchUsers()
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.error || 'Error al crear usuario')
        }
    }

    const updateUserField = (id: string, field: keyof UserRow, value: any) => {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, [field]: value } as UserRow : u))
    }

    const saveUser = async (id: string) => {
        const user = users.find(u => u._id === id)
        if (!user) return

        // Validación simple
        if (!user.name || user.name.length < 3) {
            toast.error('El nombre es obligatorio y debe tener al menos 3 caracteres')
            return
        }
        if (!user.email) {
            toast.error('El correo es obligatorio')
            return
        }
        if (user.rol === 'JEFE' && !user.department) {
            toast.error('El departamento es obligatorio para Jefe')
            return
        }

        try {
            setSavingId(id)
            const payload: Partial<UserRow> & { department?: string } = {
                name: user.name,
                email: user.email,
                rol: user.rol,
                // Enviar department solo si es JEFE
                ...(user.rol === 'JEFE' ? { department: user.department || '' } : {})
            }
            const { data } = await api.put<UserRow>(`/users/${id}`, payload)
            setUsers(prev => prev.map(u => u._id === id ? data : u))
            toast.success('Usuario actualizado')
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Error al actualizar usuario')
        } finally {
            setSavingId(null)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Usuario</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre completo */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            {...register("name", { 
                                required: "El nombre es obligatorio",
                                minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            {...register("email", { 
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Correo electrónico inválido"
                                }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </div>

                    {/* Campo handle eliminado: backend no lo requiere */}

                    {/* Contraseña */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            {...register("password", { 
                                required: "La contraseña es obligatoria",
                                minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </div>

                    {/* Rol (coincide con 'rol' en backend) */}
                    <div>
                        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                            Rol
                        </label>
                        <select
                            {...register("rol", { required: "El rol es obligatorio" })}
                            className="mt-1 block w-full min-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="JEFE">Jefe de Departamento</option>
                            <option value="TECNICO">Técnico</option>
                        </select>
                        {errors.rol && <ErrorMessage>{errors.rol.message}</ErrorMessage>}
                    </div>

                    {/* Departamento (solo para JEFE). Los técnicos NO tienen departamento */}
                    {selectedRole === 'JEFE' && (
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                Departamento
                            </label>
                            <select
                                {...register("department", { 
                                    required: "El departamento es obligatorio"  
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Selecciona un departamento</option>
                                <option value="SISTEMAS">Sistemas</option>
                                <option value="RRHH">Recursos Humanos</option>
                                <option value="CONTABILIDAD">Contabilidad</option>
                                <option value="VENTAS">Ventas</option>
                                <option value="MARKETING">Marketing</option>
                            </select>
                            {errors.department && <ErrorMessage>{errors.department.message}</ErrorMessage>}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Crear Usuario
                    </button>
                </div>
            </form>
            {/* Tabla de usuarios (excluye ADMIN) */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
                {loading ? (
                    <p className="text-gray-500">Cargando...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No hay usuarios</td>
                                    </tr>
                                ) : users.map(u => (
                                    <tr key={u._id}>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={u.name}
                                                onChange={e => updateUserField(u._id, 'name', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="email"
                                                value={u.email}
                                                onChange={e => updateUserField(u._id, 'email', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={u.rol}
                                                onChange={e => updateUserField(u._id, 'rol', e.target.value)}
                                                className="w-full min-w-[180px] border rounded px-2 py-1"
                                            >
                                                <option value="JEFE">Jefe</option>
                                                <option value="TECNICO">Técnico</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            {u.rol === 'TECNICO' ? (
                                                <span className="text-gray-500">—</span>
                                            ) : (
                                                <select
                                                    value={u.department || ''}
                                                    onChange={e => updateUserField(u._id, 'department', e.target.value)}
                                                    className="w-full border rounded px-2 py-1"
                                                >
                                                    <option value="">Selecciona</option>
                                                    <option value="SISTEMAS">Sistemas</option>
                                                    <option value="RRHH">Recursos Humanos</option>
                                                    <option value="CONTABILIDAD">Contabilidad</option>
                                                    <option value="VENTAS">Ventas</option>
                                                    <option value="MARKETING">Marketing</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                onClick={() => saveUser(u._id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                                disabled={savingId === u._id}
                                            >
                                                {savingId === u._id ? 'Guardando...' : 'Guardar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Toaster position="top-right" />
        </div>
        
    )
}