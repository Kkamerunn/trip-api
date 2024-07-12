import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Location } from '../../lib/types/types';
import { Reading } from '../../reading/entities/reading.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column('bigint')
  duration: number;

  @Column('double')
  distance: number;

  @Column()
  overspeedsCount: number;

  @Column('json')
  boundingBox: Location[];

  @OneToMany(() => Reading, (reading) => reading.trip)
  readings: Reading[];
}
