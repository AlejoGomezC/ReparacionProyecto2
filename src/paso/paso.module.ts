import { Module } from '@nestjs/common';
import { PasoService } from './paso.service';
import { PasoEntity } from './paso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasoController } from './paso.controller';


@Module({
  imports: [TypeOrmModule.forFeature([PasoEntity])],

  providers: [PasoService],

  controllers: [PasoController]
})
export class PasoModule {}
