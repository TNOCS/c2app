import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';

@WebSocketGateway()
export class DefaultWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    clients: number = 0;

    // A client has connected
    async handleConnection(socket) {
        this.clients++;
        console.log(socket.id + ' Client count: ' + this.clients)
    }

    // A client has disconnected
    async handleDisconnect() {
        this.clients--;
        console.log('Disconnect, client count: ' + this.clients)
    }

    @SubscribeMessage('request')
    handleEvent(@MessageBody() data: string): string {
        // Code to send latest positions for example
        // Simpy switch case and put the json data in the return statement
        return data
    }
}