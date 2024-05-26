/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ListaComprasService } from './lista-compras.service';
import { ListaComprasEntity } from './lista-compras.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ListaComprasService', () => {
  let service: ListaComprasService;
  let repository: Repository<ListaComprasEntity>;
  let listaComprasList: ListaComprasEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ListaComprasService],
    }).compile();

    service = module.get<ListaComprasService>(ListaComprasService);
    repository = module.get<Repository<ListaComprasEntity>>(getRepositoryToken(ListaComprasEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaComprasList = [];
    for (let i = 0; i < 5; i++) {
      const listaCompras: ListaComprasEntity = await repository.save({
        content: faker.lorem.sentence(),
      });
      listaComprasList.push(listaCompras);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all listaCompras', async () => {
    const listaCompras: ListaComprasEntity[] = await service.findAll();
    expect(listaCompras).not.toBeNull();
    expect(listaCompras).toHaveLength(listaComprasList.length);
  });

  it('findOne should return a listaCompras by id', async () => {
    const storedListaCompras: ListaComprasEntity = listaComprasList[0];
    const listaCompras: ListaComprasEntity = await service.findOne(storedListaCompras.id);
    expect(listaCompras).not.toBeNull();
    expect(listaCompras.content).toEqual(storedListaCompras.content);
  });

  it('findOne should throw an exception for an invalid listaCompras', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The listaCompras with the given id was not found");
  });

  it('create should return a new listaCompras', async () => {
    const listaCompras: ListaComprasEntity = {
      id: "",
      content: faker.lorem.sentence(),
      usuario: null,
    };

    const newListaCompras: ListaComprasEntity = await service.create(listaCompras);
    expect(newListaCompras).not.toBeNull();

    const storedListaCompras: ListaComprasEntity = await repository.findOne({ where: { id: newListaCompras.id } });
    expect(storedListaCompras).not.toBeNull();
    expect(storedListaCompras.content).toEqual(newListaCompras.content);
  });

  it('update should modify a listaCompras', async () => {
    const listaCompras: ListaComprasEntity = listaComprasList[0];
    listaCompras.content = "New content";
    const updatedListaCompras: ListaComprasEntity = await service.update(listaCompras.id, listaCompras);
    expect(updatedListaCompras).not.toBeNull();
    const storedListaCompras: ListaComprasEntity = await repository.findOne({ where: { id: listaCompras.id } });
    expect(storedListaCompras).not.toBeNull();
    expect(storedListaCompras.content).toEqual(listaCompras.content);
  });

  it('update should throw an exception for an invalid listaCompras', async () => {
    let listaCompras: ListaComprasEntity = listaComprasList[0];
    listaCompras = {
      ...listaCompras, content: "New content"
    };
    await expect(() => service.update("0", listaCompras)).rejects.toHaveProperty("message", "The listaCompras with the given id was not found");
  });

  it('delete should remove a listaCompras', async () => {
    const listaCompras: ListaComprasEntity = listaComprasList[0];
    await service.delete(listaCompras.id);
    const deletedListaCompras: ListaComprasEntity = await repository.findOne({ where: { id: listaCompras.id } });
    expect(deletedListaCompras).toBeNull();
  });

  it('delete should throw an exception for an invalid listaCompras', async () => {
    const listaCompras: ListaComprasEntity = listaComprasList[0];
    await service.delete(listaCompras.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The listaCompras with the given id was not found");
  });
});
