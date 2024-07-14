import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { Trip } from './trip/entities/trip.entity';
import { TripModule } from './trip/trip.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'trip_db',
      entities: [Trip],
      synchronize: true, // solo para desarrollo, para no tener que usar migraciones
    }),
    TripModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
