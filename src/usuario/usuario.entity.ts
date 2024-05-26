/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { ListaComprasEntity } from '../lista-compras/lista-compras.entity';
import { ComentarioEntity } from '../comentario/comentario.entity';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;

  @OneToMany(() => RecetaEntity, receta => receta.usuario)
  receta: RecetaEntity[];

  @OneToMany(() => ListaComprasEntity, listaCompras => listaCompras.usuario)
  listaCompras: ListaComprasEntity[];

  @OneToMany(() => ComentarioEntity, comentario => comentario.usuario)
    comentarios: ComentarioEntity[];
}