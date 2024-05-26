/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        publicationDate: faker.date.past(),
        preparationTime: faker.number.int(),
        difficulty: faker.lorem.word(),
        averageRating: faker.number.float({ min: 0, max: 5 }),
        usuario: null,
        comentarios: [],
        pasos: [],
        ingredientes: []
      });
      recetasList.push(receta);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne should return a receta by id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.title).toEqual(storedReceta.title);
    expect(receta.description).toEqual(storedReceta.description);
  });

  it('findOne should throw an exception for an invalid receta', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The receta with the given id was not found");
  });

  it('create should return a new receta', async () => {
    const receta: RecetaEntity = {
      id: "",
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      publicationDate: faker.date.past(),
      preparationTime: faker.number.int(),
      difficulty: faker.word.sample(),
      averageRating: faker.number.float({ min: 0, max: 5 }),
      usuario: null,
      comentarios: [],
      pasos: [],
      ingredientes: []
    };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({ where: { id: newReceta.id } });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.title).toEqual(newReceta.title);
    expect(storedReceta.description).toEqual(newReceta.description);
  });

  it('update should modify a receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.title = "New title";
    receta.description = "New description";

    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({ where: { id: receta.id } });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.title).toEqual(receta.title);
    expect(storedReceta.description).toEqual(receta.description);
  });

  it('update should throw an exception for an invalid receta', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = { ...receta, title: "New title", description: "New description" };

    await expect(() => service.update("0", receta)).rejects.toHaveProperty("message", "The receta with the given id was not found");
  });

  it('delete should remove a receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);

    const deletedReceta: RecetaEntity = await repository.findOne({ where: { id: receta.id } });
    expect(deletedReceta).toBeNull();
  });

  it('delete should throw an exception for an invalid receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);

    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The receta with the given id was not found");
  });
});
