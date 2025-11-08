import colors from 'colors';
import mongoose from 'mongoose';


export const connectDB = async ()  => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI);
        const url= `${connection.host}:${connection.port}`;
        console.log(colors.cyan.bold(`MongoDB Conectado en ${url}`));

        // Eliminar índice obsoleto 'handle_1' si existe en la colección 'users'
        try {
            const db = mongoose.connection.db;
            const usersCollection = db.collection('users');
            const indexes = await usersCollection.indexes();
            const hasHandleIndex = indexes.some((idx: any) => idx.name === 'handle_1');
            if (hasHandleIndex) {
                await usersCollection.dropIndex('handle_1');
                console.log(colors.yellow(`Índice obsoleto 'handle_1' eliminado de la colección 'users'.`));
            }
        } catch (idxErr: any) {
            // No interrumpir el arranque si no existe el índice o hay otro detalle
            if (idxErr?.codeName !== 'IndexNotFound') {
                console.log(colors.gray(`[Índices] Aviso: ${idxErr?.message || idxErr}`));
            }
        }
    } catch (error) {
        console.log(colors.bgRed.white.bold(error.message));
        process.exit(1);
    } 
}