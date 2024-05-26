import { Module } from '@nestjs/common';
import { ListaComprasService } from './lista-compras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaComprasEntity } from './lista-compras.entity';
import { ListaComprasController } from './lista-compras.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ListaComprasEntity])],

  providers: [ListaComprasService],

  controllers: [ListaComprasController]
})
export class ListaComprasModule {}
