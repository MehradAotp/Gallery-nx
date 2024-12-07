import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { EventsController } from './events/events.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'photo-exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
  ],
  controllers: [AppController, EventsController],
  providers: [AppService, EmailService],
})
export class AppModule {}
