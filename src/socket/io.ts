import { Socket } from "socket.io";

export const handleSocketConnection = (client:Socket)=>{
    client.on('goToRoom', (data:{room:string})=>{
        client.join(data.room.trim())
    })
}