/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity'

@Entity()
export class PasoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column('text')
  description: string;

  @ManyToOne(() => RecetaEntity, receta => receta.pasos)
  receta: RecetaEntity;
}