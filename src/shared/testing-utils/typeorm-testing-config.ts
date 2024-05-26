/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioEntity } from '../../comentario/comentario.entity';
import { IngredienteEntity } from '../../ingrediente/ingrediente.entity';
import { ListaComprasEntity } from '../../lista-compras/lista-compras.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity';
import { PasoEntity } from '../../paso/paso.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [ComentarioEntity, IngredienteEntity, ListaComprasEntity, RecetaEntity, PasoEntity, UsuarioEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([ComentarioEntity, IngredienteEntity, ListaComprasEntity, RecetaEntity, PasoEntity, UsuarioEntity]),
];