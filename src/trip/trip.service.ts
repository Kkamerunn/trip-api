import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { Reading } from '../reading/entities/reading.entity';
//import { getAddressFromCoordinates } from '../lib/utils/utils';
import { ReadingService } from 'src/reading/reading.service';
import { CreateTripDto } from './dto/create-trip.dto';
import * as geolib from 'geolib';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Reading)
    private readonly readingService: ReadingService,
  ) {}

  async getTrips(filters: any, limit: number, offset: number): Promise<Trip[]> {
    const query = this.tripRepository.createQueryBuilder('trip');

    if (filters.start_gte) {
      query.andWhere('trip.start >= :start_gte', {
        start_gte: filters.start_gte,
      });
    }

    if (filters.start_lte) {
      query.andWhere('trip.start <= :start_lte', {
        start_lte: filters.start_lte,
      });
    }

    if (filters.distance_gte) {
      query.andWhere('trip.distance >= :distance_gte', {
        distance_gte: filters.distance_gte,
      });
    }

    query.skip(offset).take(limit);

    return await query.getMany();
  }

  async findAll(query: any): Promise<Trip[]> {
    return this.tripRepository.find();
  }

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    const trip = this.tripRepository.create(createTripDto);
    return this.tripRepository.save(trip);
  }

  async createTripsFromReadings(): Promise<Trip[]> {
    const readings = await this.readingService.getReadings();
    if (readings.length < 5) {
      throw new Error(
        'Para construir el viaje deben haber por lo menos 5 readings',
      );
    }

    // Ordenar los readings por tiempo
    readings.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    const start = readings[0];
    const end = readings[readings.length - 1];
    const duration =
      new Date(end.time).getTime() - new Date(start.time).getTime();
    const distance = geolib.getDistance(
      { latitude: start.lat, longitude: start.lon },
      { latitude: end.lat, longitude: end.lon },
    );
    const overspeedsCount = this.calculateOverspeedsCount(readings);
    const boundingBox = geolib.getBounds(
      readings.map((r) => ({ latitude: r.lat, longitude: r.lon })),
    );

    const boundingBoxArray = [
      { lat: boundingBox.minLat, lon: boundingBox.minLng },
      { lat: boundingBox.minLat, lon: boundingBox.maxLng },
      { lat: boundingBox.maxLat, lon: boundingBox.minLng },
      { lat: boundingBox.maxLat, lon: boundingBox.maxLng },
    ];

    const trip = this.tripRepository.create({
      start: new Date(start.time),
      end: new Date(end.time),
      distance,
      duration,
      overspeedsCount,
      boundingBox: boundingBoxArray,
    });

    return [await this.tripRepository.save(trip)];
  }

  private calculateOverspeedsCount(readings: any[]): number {
    let overspeedsCount = 0;
    let inOverspeed = false;

    for (const reading of readings) {
      if (reading.speed > reading.speedLimit) {
        if (!inOverspeed) {
          inOverspeed = true;
          overspeedsCount++;
        }
      } else {
        inOverspeed = false;
      }
    }

    return overspeedsCount;
  }
}
