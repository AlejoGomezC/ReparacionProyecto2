import { Module } from '@nestjs/common';
import { IngredienteService } from './ingrediente.service';
import { IngredienteEntity } from './ingrediente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredienteController } from './ingrediente.controller';


@Module({
  imports: [TypeOrmModule.forFeature([IngredienteEntity])],
  providers: [IngredienteService],
  controllers: [IngredienteController]
})
export class IngredienteModule {}
