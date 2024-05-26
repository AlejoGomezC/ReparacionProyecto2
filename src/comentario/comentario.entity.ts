/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity()
export class ComentarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @ManyToOne(() => RecetaEntity, receta => receta.comentarios)
  receta: RecetaEntity;

  @ManyToOne(() => UsuarioEntity  , usuario => usuario.comentarios)
    usuario: UsuarioEntity;

}