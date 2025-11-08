import { isAxiosError } from 'axios';
import api from '../config/axios';
import type { User } from '../types';

// Obtener todos los usuarios
export async function getAllUsers() {
    try {
        const response = await api.get<User[]>('/users')
        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// Eliminar usuario
export async function deleteUser(userId: string) {
    try {
        await api.delete(`/users/${userId}`)
        return true
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        return false
    }
}

export async function getUser(){
    try{
        const response = await api.get<User>('/user')
        console.log('Respuesta de /user:', response)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            console.error('Error en getUser:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.config?.headers
            })
            throw new Error (error.response.data.error)
        }
    }
}