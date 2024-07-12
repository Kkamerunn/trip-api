import { Module } from '@nestjs/common';
import { Reading } from 'src/reading/entities/reading.entity';
import { Trip } from './entities/trip.entity';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Reading])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
