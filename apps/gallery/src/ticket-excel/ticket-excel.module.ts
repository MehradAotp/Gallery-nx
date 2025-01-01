import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketFlight, TicketFlightSchema } from './ticket-excel.schema';
import { TicketFlightController } from './ticket-excel.controller';
import { TicketFlightService } from './ticket-excel.service';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: TicketFlight.name, schema: TicketFlightSchema },
    ]),
  ],
  controllers: [TicketFlightController],
  providers: [TicketFlightService],
})
export class TicketFlightModule {}
