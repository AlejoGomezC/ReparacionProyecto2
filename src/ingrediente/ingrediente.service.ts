/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredienteEntity } from './ingrediente.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class IngredienteService {
    constructor(
        @InjectRepository(IngredienteEntity)
        private readonly IngredienteRepositoty: Repository<IngredienteEntity>,
    ) {}

    async findAll(): Promise<IngredienteEntity[]> {
        return await this.IngredienteRepositoty.find({ relations: ['receta'] });
    }

    async findOne(id: string): Promise<IngredienteEntity> {
        const IngredienteEntity: IngredienteEntity = await this.IngredienteRepositoty.findOne({ where: { id }, relations: ['receta'] });
        if (!IngredienteEntity) {
            throw new BusinessLogicException("The ingrediente with the given id was not found", BusinessError.NOT_FOUND);
        }
        return IngredienteEntity;
    }

    async create(IngredienteEntity: IngredienteEntity): Promise<IngredienteEntity> {
        return await this.IngredienteRepositoty.save(IngredienteEntity);
    }

    async update(id: string, IngredienteEntity: IngredienteEntity): Promise<IngredienteEntity> {
        const persistedIngredienteEntity: IngredienteEntity = await this.IngredienteRepositoty.findOne({ where: { id } });
        if (!persistedIngredienteEntity) {
            throw new BusinessLogicException("The ingrediente with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.IngredienteRepositoty.save({ ...persistedIngredienteEntity, ...IngredienteEntity });
    }

    async delete(id: string): Promise<void> {
        const IngredienteEntity: IngredienteEntity = await this.IngredienteRepositoty.findOne({ where: { id } });
        if (!IngredienteEntity) {
            throw new BusinessLogicException("The ingrediente with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.IngredienteRepositoty.remove(IngredienteEntity);
    }
}
