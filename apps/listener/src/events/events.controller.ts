import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Controller('events')
export class EventsController {
  constructor(private readonly emailService: EmailService) {}

  @RabbitSubscribe({
    exchange: 'photo-exchange',
    routingKey: 'photo-approved',
    queue: 'photo-approved-queue',
    queueOptions: { durable: true },
  })
  async handlePhotoApproved(msg: {
    photoId: string;
    username: string;
    userEmail: string;
  }) {
    console.log('Received photo approved message:', msg);
    await this.emailService.sendEmail(
      msg.userEmail,
      'عکس شما تایید شد.',
      `سلام ${msg.username} ، وضعیت عکس شما به تایید شد تغییر کرده است.`
    );
    console.log(`Photo approved: ${msg.photoId}, Username: ${msg.username}`);
  }

  @RabbitSubscribe({
    exchange: 'photo-exchange',
    routingKey: 'photo-rejected',
    queue: 'photo-rejected-queue',
    queueOptions: { durable: true },
  })
  async handlePhotoRejected(msg: {
    photoId: string;
    username: string;
    userEmail: string;
  }) {
    console.log('Received photo approved message:', msg);
    await this.emailService.sendEmail(
      msg.userEmail,
      'عکس شما رد شد.',
      `سلام ${msg.username} ، وضعیت عکس شما به رد شد تغییر کرده است.`
    );
    console.log(`Photo rejected: ${msg.photoId}, Username: ${msg.username}`);
  }
}
