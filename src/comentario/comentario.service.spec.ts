/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComentarioService } from './comentario.service';
import { ComentarioEntity } from './comentario.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ComentarioService', () => {
  let service: ComentarioService;
  let repository: Repository<ComentarioEntity>;
  let comentariosList: ComentarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ComentarioService],
    }).compile();

    service = module.get<ComentarioService>(ComentarioService);
    repository = module.get<Repository<ComentarioEntity>>(getRepositoryToken(ComentarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    comentariosList = [];
    for (let i = 0; i < 5; i++) {
      const comentario: ComentarioEntity = await repository.save({
        content: faker.lorem.sentence(),
        publicationDate: faker.date.recent(),
      });
      comentariosList.push(comentario);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all comentarios', async () => {
    const comentarios: ComentarioEntity[] = await service.findAll();
    expect(comentarios).not.toBeNull();
    expect(comentarios).toHaveLength(comentariosList.length);
  });

  it('findOne should return a comentario by id', async () => {
    const storedComentario: ComentarioEntity = comentariosList[0];
    const comentario: ComentarioEntity = await service.findOne(storedComentario.id);
    expect(comentario).not.toBeNull();
    expect(comentario.content).toEqual(storedComentario.content);
    expect(comentario.publicationDate).toEqual(storedComentario.publicationDate);
  });

  it('findOne should throw an exception for an invalid comentario', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The comentario with the given id was not found");
  });

  it('create should return a new comentario', async () => {
    const comentario: ComentarioEntity = {
      id: "",
      content: faker.lorem.sentence(),
      publicationDate: faker.date.recent(),
      receta: null,
      usuario: null,
    };

    const newComentario: ComentarioEntity = await service.create(comentario);
    expect(newComentario).not.toBeNull();

    const storedComentario: ComentarioEntity = await repository.findOne({ where: { id: newComentario.id } });
    expect(storedComentario).not.toBeNull();
    expect(storedComentario.content).toEqual(newComentario.content);
    expect(storedComentario.publicationDate).toEqual(newComentario.publicationDate);
  });

  it('update should modify a comentario', async () => {
    const comentario: ComentarioEntity = comentariosList[0];
    comentario.content = "New content";
    const updatedComentario: ComentarioEntity = await service.update(comentario.id, comentario);
    expect(updatedComentario).not.toBeNull();
    const storedComentario: ComentarioEntity = await repository.findOne({ where: { id: comentario.id } });
    expect(storedComentario).not.toBeNull();
    expect(storedComentario.content).toEqual(comentario.content);
  });

  it('update should throw an exception for an invalid comentario', async () => {
    let comentario: ComentarioEntity = comentariosList[0];
    comentario = {
      ...comentario, content: "New content"
    };
    await expect(() => service.update("0", comentario)).rejects.toHaveProperty("message", "The comentario with the given id was not found");
  });

  it('delete should remove a comentario', async () => {
    const comentario: ComentarioEntity = comentariosList[0];
    await service.delete(comentario.id);
    const deletedComentario: ComentarioEntity = await repository.findOne({ where: { id: comentario.id } });
    expect(deletedComentario).toBeNull();
  });

  it('delete should throw an exception for an invalid comentario', async () => {
    const comentario: ComentarioEntity = comentariosList[0];
    await service.delete(comentario.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The comentario with the given id was not found");
  });
});
