import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import router from './router'

connectDB()

const app = express()
//cors
app.use(cors(corsConfig))
//leer datos de formularios

app.use(express.json())

app.use('/',router)


export default app