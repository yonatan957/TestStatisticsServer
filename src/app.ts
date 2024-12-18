import express from 'express'
import 'dotenv/config'
import usersController from './controllers/users'
import { conectToMongo } from './config/DB'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { handleSocketConnection } from './socket/io'

const PORT = process.env.PORT
const app = express()
const httpServer:http.Server = http.createServer(app)
export const io = new Server(httpServer,{
    cors:{
        origin: '*',
        methods:'*'
    }
})

io.on('connection', handleSocketConnection)

conectToMongo()

app.use(express.json())
app.use(cors())

app.use('/users', usersController)

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})