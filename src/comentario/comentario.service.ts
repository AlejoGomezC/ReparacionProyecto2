/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComentarioEntity } from './comentario.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException , BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ComentarioService {
    constructor(
        @InjectRepository(ComentarioEntity)
        private readonly comentarioRepository: Repository<ComentarioEntity>,
    ) { }

    async findAll(): Promise<ComentarioEntity[]> {
        return await this.comentarioRepository.find({ relations: ['receta'] });
    }

    async findOne(id: string): Promise<ComentarioEntity> {
        const comentario: ComentarioEntity = await this.comentarioRepository.findOne({ where: { id }, relations: ['receta'] });
        if (!comentario) {
            throw new BusinessLogicException("The comentario with the given id was not found", BusinessError.NOT_FOUND);
        }
        return comentario;
    }

    async create(comentario: ComentarioEntity): Promise<ComentarioEntity> {
        return await this.comentarioRepository.save(comentario);
    }

    async update(id: string, comentario: ComentarioEntity): Promise<ComentarioEntity> {
        const persistedComentario: ComentarioEntity = await this.comentarioRepository.findOne({ where: { id } });
        if (!persistedComentario) {
            throw new BusinessLogicException("The comentario with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.comentarioRepository.save({ ...persistedComentario, ...comentario });
    }

    async delete(id: string): Promise<void> {
        const comentario: ComentarioEntity = await this.comentarioRepository.findOne({ where: { id } });
        if (!comentario) {
            throw new BusinessLogicException("The comentario with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.comentarioRepository.remove(comentario);
    }
}
