import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatGateway } from 'src/modules/message/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [],
  providers: [MessageService, ChatGateway],
  exports: [MessageService],
})
export class MessageModule {}
