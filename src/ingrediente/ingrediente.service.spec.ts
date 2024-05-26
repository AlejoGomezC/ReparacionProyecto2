/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngredienteService } from './ingrediente.service';
import { IngredienteEntity } from './ingrediente.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('IngredienteService', () => {
  let service: IngredienteService;
  let repository: Repository<IngredienteEntity>;
  let ingredientesList: IngredienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [IngredienteService],
    }).compile();

    service = module.get<IngredienteService>(IngredienteService);
    repository = module.get<Repository<IngredienteEntity>>(getRepositoryToken(IngredienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ingredientesList = [];
    for (let i = 0; i < 5; i++) {
      const ingredientes: IngredienteEntity = await repository.save({
        name: faker.lorem.word(),
        unitOfMeasurement: faker.lorem.word(),
      });
      ingredientesList.push(ingredientes);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ingredientes', async () => {
    const ingredientes: IngredienteEntity[] = await service.findAll();
    expect(ingredientes).not.toBeNull();
    expect(ingredientes).toHaveLength(ingredientesList.length);
  });

  it('findOne should return an ingrediente by id', async () => {
    const storedIngredientes: IngredienteEntity = ingredientesList[0];
    const ingredientes: IngredienteEntity = await service.findOne(storedIngredientes.id);
    expect(ingredientes).not.toBeNull();
    expect(ingredientes.name).toEqual(storedIngredientes.name);
    expect(ingredientes.unitOfMeasurement).toEqual(storedIngredientes.unitOfMeasurement);
  });

  it('findOne should throw an exception for an invalid ingrediente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The ingrediente with the given id was not found");
  });

  it('create should return a new ingrediente', async () => {
    const ingredientes: IngredienteEntity = {
      id: "",
      name: faker.lorem.word(),
      unitOfMeasurement: faker.lorem.word(),
      receta: null,
    };

    const newIngredientes: IngredienteEntity = await service.create(ingredientes);
    expect(newIngredientes).not.toBeNull();

    const storedIngredientes: IngredienteEntity = await repository.findOne({ where: { id: newIngredientes.id } });
    expect(storedIngredientes).not.toBeNull();
    expect(storedIngredientes.name).toEqual(newIngredientes.name);
    expect(storedIngredientes.unitOfMeasurement).toEqual(newIngredientes.unitOfMeasurement);
  });

  it('update should modify an ingrediente', async () => {
    const ingredientes: IngredienteEntity = ingredientesList[0];
    ingredientes.name = "New name";
    const updatedIngredientes: IngredienteEntity = await service.update(ingredientes.id, ingredientes);
    expect(updatedIngredientes).not.toBeNull();
    const storedIngredientes: IngredienteEntity = await repository.findOne({ where: { id: ingredientes.id } });
    expect(storedIngredientes).not.toBeNull();
    expect(storedIngredientes.name).toEqual(ingredientes.name);
  });

  it('update should throw an exception for an invalid ingrediente', async () => {
    let ingredientes: IngredienteEntity = ingredientesList[0];
    ingredientes = {
      ...ingredientes, name: "New name"
    };
    await expect(() => service.update("0", ingredientes)).rejects.toHaveProperty("message", "The ingrediente with the given id was not found");
  });

  it('delete should remove an ingrediente', async () => {
    const ingredientes: IngredienteEntity = ingredientesList[0];
    await service.delete(ingredientes.id);
    const deletedIngredientes: IngredienteEntity = await repository.findOne({ where: { id: ingredientes.id } });
    expect(deletedIngredientes).toBeNull();
  });

  it('delete should throw an exception for an invalid ingrediente', async () => {
    const ingredientes: IngredienteEntity = ingredientesList[0];
    await service.delete(ingredientes.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The ingrediente with the given id was not found");
  });
});
