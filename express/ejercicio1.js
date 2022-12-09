const express = require('express')
const Container = require('../desafio/app')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () =>{
    console.log(`Servidor HTTP escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor, ${error}`))

const routeProducts = express.Router()

app.use('/api/productos', routeProducts)
app.use(express.static('/public'))
routeProducts.use(express.urlencoded({ extended: true }))
routeProducts.use(express.json())

const products = new Container('productos.txt')

routeProducts.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

routeProducts.get('/productos', async (req, res) => {
    const productsList = await products.getAll()
    res.json(productsList)
})

routeProducts.get('/api/productos/:id', async (req, res) =>{
    const productById = await products.getById(parseInt(req.params.id))
    productById === null ? res.json({ Error:  'El producto no fue encontrado' }) : res.json(productById)
})

routeProducts.post('/addProduct', async (req, res) =>{
    const savedProduct = await products.save(req.body)
    res.json(savedProduct)
})
routeProducts.put('/api/productos/:id', async (req, res) =>{
    const updateInfo = req.body
    const productsList = await products.getAll()
    regToUpdate = productsList.findIndex(product => product.id === parseInt(req.params.id))
    if (regToUpdate === -1) {
        return res.send({ Error:  'El producto no fue encontrado' })
    }
    productsList[regToUpdate] = { ...updateInfo, id: parseInt(req.params.id) }
    await products.saveData(productsList)
    res.json({ ...updateInfo, id: parseInt(req.params.id) })
})

routeProducts.delete('/api/productos/:id', async (req, res) =>{
    const deletedId = await products.getById(parseInt(req.params.id))
    await products.deleteById(parseInt(req.params.id))
    deletedId === null
        ? res.json( {'Producto ': `${parseInt(req.params.id)} no fue encontrado`} )
        : res.json( {'Se ha eliminado eliminado': deletedId} )
})