import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { Trip } from './entities/trip.entity';
import { Reading } from '../reading/entities/reading.entity';
import { CreateTripDto } from './dto/create-trip.dto';

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

  @Get('test')
  async testDatabaseConnection(): Promise<string> {
    const trips = await this.tripService.findAll({});
    return trips.length > 0
      ? 'Database connection is working!'
      : 'No trips found, but connection is working!';
  }

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    return this.tripService.create(createTripDto);
  }

  @Post('create-from-readings')
  async createFromReadings(): Promise<Trip[]> {
    try {
      return await this.tripService.createTripsFromReadings();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
