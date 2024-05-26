/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class RecetaService {
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
    ) {}

    async findAll(): Promise<RecetaEntity[]> {
        return await this.recetaRepository.find({ relations: ['usuario', 'comentarios', 'pasos', 'ingredientes'] });
    }

    async findOne(id: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id }, relations: ['usuario', 'comentarios', 'pasos', 'ingredientes'] });
        if (!receta) {
            throw new BusinessLogicException("The receta with the given id was not found", BusinessError.NOT_FOUND);
        }
        return receta;
    }

    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({ where: { id } });
        if (!persistedReceta) {
            throw new BusinessLogicException("The receta with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.recetaRepository.save({ ...persistedReceta, ...receta });
    }

    async delete(id: string): Promise<void> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id } });
        if (!receta) {
            throw new BusinessLogicException("The receta with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.recetaRepository.remove(receta);
    }
}
