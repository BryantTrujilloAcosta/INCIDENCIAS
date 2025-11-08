


export type User = {
    _id: string
    handle: string
    name: string
    email: string
    password: string
    rol: 'ADMIN' | 'JEFE' | 'TECNICO'
    department?: string
}

export type RegisterForm = Pick<User, 'handle' | 'name' | 'email' | 'rol' | 'department'> & {
    password: string
}
export type LoginForm = Pick<User,'email' > &{
    password: string
}