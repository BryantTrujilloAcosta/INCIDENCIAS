import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateJWT = (playload: JwtPayload)=>{
    const token = jwt.sign(playload,process.env.JWT_SECRET,{
        expiresIn:'180d'
    })
    return token;
}