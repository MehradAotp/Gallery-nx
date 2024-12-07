import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor(private readonly ampConnection: AmqpConnection) {}

  async publishPhotoApprovedEvent(
    photoId: string,
    username: string,
    email: string,
  ) {
    await this.ampConnection.publish('photo-exchange', 'photo-approved', {
      photoId,
      username,
      userEmail: email,
    });
  }
  async publishPhotoRejectedEvent(
    photoId: string,
    username: string,
    email: string,
  ) {
    await this.ampConnection.publish('photo-exchange', 'photo-rejected', {
      photoId,
      username,
      userEmail: email,
    });
  }
}
