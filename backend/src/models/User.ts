import mongoose from 'mongoose';

export interface IUser{
    name: string
    email:string
    password:string
    rol: string
    department?: string
}
const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        trim: true
    },
    email :{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password :{
        type: String,
        required: true,
        trim: true
    },
    rol :{
        type: String,
        required: true,
        trim: true
    },
    department :{
        type: String,
        trim: true
    }
})

const User = mongoose.model<IUser>('User',userSchema)
export default User
