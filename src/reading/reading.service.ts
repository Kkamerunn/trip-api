import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReadingService {
  async getReadings(): Promise<any[]> {
    const url = `https://virtserver.swaggerhub.com/CONTABILIDAD/JooycarTest/1.0.0/api/trips/v1`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting readings:', error);
      throw new Error('Error getting readings');
    }
  }
}
