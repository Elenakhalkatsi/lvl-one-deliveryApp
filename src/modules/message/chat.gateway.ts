import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/modules/message/message.service';
import { Message } from 'src/entities/message.entity';

@WebSocketGateway(4000, { namespace: 'message' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @Inject()
  messageService: MessageService;

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  private count = 0;

  public async handleDisconnect(client: any): Promise<void> {
    this.count -= 1;
    this.logger.log(`Disconnected: ${this.count} connections`);
  }

  public async handleConnection(client: any, ...args: any[]): Promise<void> {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connections`);
    const messages: Message[] = await this.messageService.getAll();
    client.emit('all-messages-to-client', messages);
  }

  public async afterInit(server: any): Promise<void> {
    this.logger.log('MessageGateway Initialized');
  }

  @SubscribeMessage('new-message-to-server')
  async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sender: string; message: string },
  ): Promise<void> {
    const message: Message = await this.messageService.createMessage(
      data.sender,
      data.message,
    );
    this.wss.emit('new-message-to-client', { message });
  }
}
