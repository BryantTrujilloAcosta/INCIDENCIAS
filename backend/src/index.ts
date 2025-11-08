import colors from 'colors'
import server from './server'

const port = process.env.PORT || 4000

server.listen(port,()=>{
    console.log(colors.blue.bold(`Servidor funcionando en el puerto ${port}`))
})

let productName = "Tablet"
let isAuth = false
let price = 30

type Product = {
    id: number
    price: number
    name: string
}

type ProductID = Pick<Product,'id'>



let product : Product = {
    id: 1,
    price: 30,
    name: "Tablet"
}
let product2 : Product = {
    id: 2,
    price: 30,
    name: "Tablet 11 Pulgadas",
  
}

const number = [1,2,3,4,5]