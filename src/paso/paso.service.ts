/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasoEntity } from './paso.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class PasoService {
    constructor(
        @InjectRepository(PasoEntity)
        private readonly pasoRepository: Repository<PasoEntity>,
    ) {}

    async findAll(): Promise<PasoEntity[]> {
        return await this.pasoRepository.find({ relations: ['receta'] });
    }

    async findOne(id: string): Promise<PasoEntity> {
        const paso: PasoEntity = await this.pasoRepository.findOne({ where: { id }, relations: ['receta'] });
        if (!paso) {
            throw new BusinessLogicException("The paso with the given id was not found", BusinessError.NOT_FOUND);
        }
        return paso;
    }

    async create(paso: PasoEntity): Promise<PasoEntity> {
        return await this.pasoRepository.save(paso);
    }

    async update(id: string, paso: PasoEntity): Promise<PasoEntity> {
        const persistedPaso: PasoEntity = await this.pasoRepository.findOne({ where: { id } });
        if (!persistedPaso) {
            throw new BusinessLogicException("The paso with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.pasoRepository.save({ ...persistedPaso, ...paso });
    }

    async delete(id: string): Promise<void> {
        const paso: PasoEntity = await this.pasoRepository.findOne({ where: { id } });
        if (!paso) {
            throw new BusinessLogicException("The paso with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.pasoRepository.remove(paso);
    }
}
