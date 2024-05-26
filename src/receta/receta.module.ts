import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaController } from './receta.controller';


@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity])],

  providers: [RecetaService],

  controllers: [RecetaController]
})
export class RecetaModule {}
