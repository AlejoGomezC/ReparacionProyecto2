/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity'
import { ComentarioEntity } from '../comentario/comentario.entity';
import { PasoEntity } from '../paso/paso.entity';
import { IngredienteEntity } from '../ingrediente/ingrediente.entity';

@Entity()
export class RecetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @Column()
  preparationTime: number;

  @Column()
  difficulty: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0.0 })
  averageRating: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.receta)
  usuario: UsuarioEntity;

  @OneToMany(() => ComentarioEntity, comentario => comentario.receta)
  comentarios: ComentarioEntity[];

  @OneToMany(() => PasoEntity, pasos => pasos.receta)
  pasos: PasoEntity[];

  @OneToMany(() => IngredienteEntity, ingredientes => ingredientes.receta)
  ingredientes: IngredienteEntity[];
}