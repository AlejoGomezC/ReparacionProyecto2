/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity'

@Entity()
export class IngredienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  unitOfMeasurement: string;

  @ManyToOne(() => RecetaEntity, receta => receta.ingredientes)
  receta: RecetaEntity;
}