import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { User, UserSchema } from './users/users.schema';
import { AuthModule } from './auth/auth.module';
import { PhotosService } from './photos/photos.service';
import { PhotosModule } from './photos/photos.module';
import { Category, CategorySchema } from './category/category.schema';
import { PhotoDocument, PhotoSchema } from './photos/photos.schema';
import { CategoryModule } from './category/category.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventsService } from './events/events.service';
import { ExcelModule } from './excel/excel.module';
import { AirlineExcelModule } from './airline-excel/airline-excel.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { TicketFlightModule } from './ticket-excel/ticket-excel.module';
import { SnappExcelModule } from './snapp-excel/snapp-excel.module';
import { IranHotelExcelModule } from './iran-hotel-excel/iran-hotel-excel.module';
config();
@Module({
  imports: [
    UsersModule,
    CqrsModule,
    CategoryModule,
    MongooseModule.forRoot(process.env.MONGODB),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: PhotoDocument.name, schema: PhotoSchema },
    ]),
    AuthModule,
    PhotosModule,
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
    ExcelModule,
    AirlineExcelModule,
    SuppliersModule,
    TicketFlightModule,
    SnappExcelModule,
    IranHotelExcelModule,
  ],
  controllers: [AppController, UsersController],
  providers: [UsersService, PhotosService, EventsService],
})
export class AppModule {}
