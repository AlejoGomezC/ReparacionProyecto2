/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaComprasEntity } from './lista-compras.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ListaComprasService {
    constructor(
        @InjectRepository(ListaComprasEntity)
        private readonly listaComprasRepository: Repository<ListaComprasEntity>,
    ) {}

    async findAll(): Promise<ListaComprasEntity[]> {
        return await this.listaComprasRepository.find({ relations: ['usuario'] });
    }

    async findOne(id: string): Promise<ListaComprasEntity> {
        const listaCompras: ListaComprasEntity = await this.listaComprasRepository.findOne({ where: { id }, relations: ['usuario'] });
        if (!listaCompras) {
            throw new BusinessLogicException("The listaCompras with the given id was not found", BusinessError.NOT_FOUND);
        }
        return listaCompras;
    }

    async create(listaCompras: ListaComprasEntity): Promise<ListaComprasEntity> {
        return await this.listaComprasRepository.save(listaCompras);
    }

    async update(id: string, listaCompras: ListaComprasEntity): Promise<ListaComprasEntity> {
        const persistedListaCompras: ListaComprasEntity = await this.listaComprasRepository.findOne({ where: { id } });
        if (!persistedListaCompras) {
            throw new BusinessLogicException("The listaCompras with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.listaComprasRepository.save({ ...persistedListaCompras, ...listaCompras });
    }

    async delete(id: string): Promise<void> {
        const listaCompras: ListaComprasEntity = await this.listaComprasRepository.findOne({ where: { id } });
        if (!listaCompras) {
            throw new BusinessLogicException("The listaCompras with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.listaComprasRepository.remove(listaCompras);
    }
}
