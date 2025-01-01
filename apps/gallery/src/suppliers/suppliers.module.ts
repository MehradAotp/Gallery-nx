import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Suppliers, suppliersSchema } from './suppliers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suppliers.name, schema: suppliersSchema },
    ]),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
