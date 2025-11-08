import { Request, Response } from "express"
import { validationResult } from "express-validator"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"


export const createAccount = async(req: Request, res: Response) => {
    
    const {email,password} = req.body
    
    const userExists = await User.findOne({email})
    if(userExists){
        const error = new Error('Usuario con ese email ya registrado')
        return res.status(409).json({error: error.message})

    }
    
    const user = new User(req.body)
    user.password= await hashPassword(password)


    await user.save()

    return res.status(201).send('Usuario creado correctamente')
}

export const login = async (req: Request, res: Response) => {
     // Manejar errores
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {email,password} = req.body
    
    //Revisar si el usuario esta registrado
    const user = await User.findOne({email})
    if(!user){
        const error = new Error('El usuario no existe')
        return res.status(404).json({error: error.message})
    }
    //comprobar contraseña
    const isPasswordCorrect =await checkPassword(password,user.password)
    if(!isPasswordCorrect){
        const error = new Error('La contraseña es incorrecta')
        return res.status(401).json({error: error.message})
    }
    const token = generateJWT({id: user._id})

    res.send(token)
}

export const getUser= async (req: Request, res: Response) => {
    res.json(req.user)
}

// Listar usuarios (excluye Administrador). Solo accesible para Administrador
export const listUsers = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.rol !== 'Administrador') {
            return res.status(403).json({ error: 'No autorizado' })
        }
        const users = await User.find({ rol: { $ne: 'Administrador' } }).select('-password')
        res.json(users)
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error al listar usuarios' })
    }
}

// Actualizar usuario por id. Solo Administrador. Campos permitidos: name, email, rol, department, password (opcional)
export const updateUser = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.rol !== 'Administrador') {
            return res.status(403).json({ error: 'No autorizado' })
        }

        const { id } = req.params
        const { name, email, rol, department, password } = req.body as Partial<{ name: string, email: string, rol: string, department?: string, password?: string }>

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // No permitir convertir a Administrador aquí para mantener la regla de exclusión en listado (opcional)
        if (rol === 'Administrador') {
            return res.status(400).json({ error: 'No se permite cambiar el rol a Administrador desde esta interfaz' })
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email })
            if (emailExists && emailExists._id.toString() !== id) {
                return res.status(409).json({ error: 'Usuario con ese email ya registrado' })
            }
            user.email = email
        }

        if (name) user.name = name
        if (rol) {
            user.rol = rol
            // Si el rol es TECNICO, no debe tener departamento
            if (rol === 'TECNICO') {
                user.department = undefined
            }
        }
        // Solo aplicar cambio de departamento si se envía y el rol no es TECNICO
        if (typeof department !== 'undefined' && user.rol !== 'TECNICO') {
            user.department = department
        }
        if (password && password.length >= 6) {
            user.password = await hashPassword(password)
        }

        await user.save()
        const sanitized = await User.findById(id).select('-password')
        res.json(sanitized)
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error al actualizar usuario' })
    }
}