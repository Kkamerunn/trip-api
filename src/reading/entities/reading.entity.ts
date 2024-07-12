import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Trip } from "../../trip/entities/trip.entity";

export class Reading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: number;

  @Column()
  speed: number;

  @Column()
  speedLimit: number;

  @Column('json')
  location: Location[];

  @ManyToOne(() => Trip, (trip) => trip.readings)
  trip: Trip;
}
