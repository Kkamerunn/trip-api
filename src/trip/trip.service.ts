import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { Reading } from '../reading/entities/reading.entity';
import { getAddressFromCoordinates } from '../lib/utils/utils';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(Reading)
    private readingRepository: Repository<Reading>,
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

  async createTrip(readings: Reading[]): Promise<Trip> {
    if (readings.length < 5 || readings.some((reading) => !reading.time)) {
      throw new Error('Invalid readings');
    }

    const startReading = readings.reduce((prev, curr) =>
      prev.time < curr.time ? prev : curr,
    );
    const endReading = readings.reduce((prev, curr) =>
      prev.time > curr.time ? prev : curr,
    );

    // const startAddress = await getAddressFromCoordinates(
    //   startReading.lat,
    //   startReading.lon,
    // );
    // const endAddress = await getAddressFromCoordinates(
    //   endReading.lat,
    //   endReading.lon,
    // );

    const trip = new Trip();
    // trip.start = { ...startReading, address: startAddress };
    // trip.end = { ...endReading, address: endAddress };
    // trip.duration = endReading.time - startReading.time;
    // trip.distance = readings.reduce(
    //   (total, reading) => total + reading.distance,
    //   0,
    // );
    trip.overspeedsCount = this.calculateOverspeedsCount(readings);
    // trip.boundingBox = this.calculateBoundingBox(readings);

    return await this.tripRepository.save(trip);
  }

  private calculateOverspeedsCount(readings: Reading[]): number {
    // Implementar la lógica para calcular los overspeedsCount
    return 0;
  }

  private calculateBoundingBox(readings: Reading[]): string[] {
    // Implementar la lógica para calcular el bounding box
    return [''];
  }
}
