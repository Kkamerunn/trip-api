import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { Trip } from './entities/trip.entity';
import { Reading } from '../reading/entities/reading.entity';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get()
  async getTrips(
    @Query('start_gte') start_gte: string,
    @Query('start_lte') start_lte: string,
    @Query('distance_gte') distance_gte: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<Trip[]> {
    const filters = { start_gte, start_lte, distance_gte };
    return await this.tripService.getTrips(filters, limit, offset);
  }

  @Post()
  async createTrip(@Body() readings: Reading[]): Promise<Trip> {
    return await this.tripService.createTrip(readings);
  }
}
