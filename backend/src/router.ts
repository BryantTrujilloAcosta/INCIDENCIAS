import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, listUsers, login, updateUser } from './handlers'
import { authenticate } from './middleware/Auth'
import { handleInputErrors } from './middleware/validation'
const router = Router()

/* Autenticacion y registro */
router.post('/auth/register',
    body('email')
        .isEmail()
        .withMessage('El email es obligatorio y debe ser un email válido'),
    body('name')
        .notEmpty()
        .withMessage('El nombre es obligatorio'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol')
        .notEmpty()
        .withMessage('El usuario debe tener un rol válido'),
    handleInputErrors,
    createAccount
)
router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El email es obligatorio y debe ser un email válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    login
)

router.get('/user',authenticate,getUser)
router.get('/users', authenticate, listUsers)
router.put('/users/:id', authenticate, updateUser)
export default router