import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ComentarioModule } from './comentario/comentario.module';
import { IngredienteModule } from './ingrediente/ingrediente.module';
import { ListaComprasModule } from './lista-compras/lista-compras.module';
import { PasoModule } from './paso/paso.module';
import { RecetaModule } from './receta/receta.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComentarioEntity } from './comentario/comentario.entity';
import { IngredienteEntity } from './ingrediente/ingrediente.entity';
import { ListaComprasEntity } from './lista-compras/lista-compras.entity';
import { PasoEntity } from './paso/paso.entity';
import { RecetaEntity } from './receta/receta.entity';
import { UsuarioEntity } from './usuario/usuario.entity';

@Module({
  imports: [ComentarioModule, IngredienteModule, ListaComprasModule, PasoModule, RecetaModule, UsuarioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'proyecto_db',
      entities: [ComentarioEntity, IngredienteEntity, ListaComprasEntity, PasoEntity, RecetaEntity, UsuarioEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
