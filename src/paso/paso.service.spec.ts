/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasoService } from './paso.service';
import { PasoEntity } from './paso.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('PasoService', () => {
  let service: PasoService;
  let repository: Repository<PasoEntity>;
  let pasoList: PasoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PasoService],
    }).compile();

    service = module.get<PasoService>(PasoService);
    repository = module.get<Repository<PasoEntity>>(getRepositoryToken(PasoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pasoList = [];
    for (let i = 0; i < 5; i++) {
      const paso: PasoEntity = await repository.save({
        number: faker.number.int(),
        description: faker.lorem.sentence(),
      });
      pasoList.push(paso);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all paso', async () => {
    const paso: PasoEntity[] = await service.findAll();
    expect(paso).not.toBeNull();
    expect(paso).toHaveLength(pasoList.length);
  });

  it('findOne should return a paso by id', async () => {
    const storedPaso: PasoEntity = pasoList[0];
    const paso: PasoEntity = await service.findOne(storedPaso.id);
    expect(paso).not.toBeNull();
    expect(paso.number).toEqual(storedPaso.number);
    expect(paso.description).toEqual(storedPaso.description);
  });

  it('findOne should throw an exception for an invalid paso', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The paso with the given id was not found");
  });

  it('create should return a new paso', async () => {
    const paso: PasoEntity = {
      id: "",
      number: faker.number.int(),
      description: faker.lorem.sentence(),
      receta: null,
    };

    const newPaso: PasoEntity = await service.create(paso);
    expect(newPaso).not.toBeNull();

    const storedPaso: PasoEntity = await repository.findOne({ where: { id: newPaso.id } });
    expect(storedPaso).not.toBeNull();
    expect(storedPaso.number).toEqual(newPaso.number);
    expect(storedPaso.description).toEqual(newPaso.description);
  });

  it('update should modify a paso', async () => {
    const paso: PasoEntity = pasoList[0];
    paso.number = 2;
    paso.description = "New description";
    const updatedPaso: PasoEntity = await service.update(paso.id, paso);
    expect(updatedPaso).not.toBeNull();
    const storedPaso: PasoEntity = await repository.findOne({ where: { id: paso.id } });
    expect(storedPaso).not.toBeNull();
    expect(storedPaso.number).toEqual(paso.number);
    expect(storedPaso.description).toEqual(paso.description);
  });

  it('update should throw an exception for an invalid paso', async () => {
    let paso: PasoEntity = pasoList[0];
    paso = {
      ...paso, number: 2, description: "New description"
    };
    await expect(() => service.update("0", paso)).rejects.toHaveProperty("message", "The paso with the given id was not found");
  });

  it('delete should remove a paso', async () => {
    const paso: PasoEntity = pasoList[0];
    await service.delete(paso.id);
    const deletedPaso: PasoEntity = await repository.findOne({ where: { id: paso.id } });
    expect(deletedPaso).toBeNull();
  });

  it('delete should throw an exception for an invalid paso', async () => {
    const paso: PasoEntity = pasoList[0];
    await service.delete(paso.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The paso with the given id was not found");
  });
});
