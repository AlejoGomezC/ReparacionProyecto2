/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        registrationDate: faker.date.past(),
        receta: [],
        listaCompras: []
      });
      usuariosList.push(usuario);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all usuarios', async () => {
    const usuarios: UsuarioEntity[] = await service.findAll();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuariosList.length);
  });

  it('findOne should return a usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findOne(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.name).toEqual(storedUsuario.name);
    expect(usuario.email).toEqual(storedUsuario.email);
  });

  it('findOne should throw an exception for an invalid usuario', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found");
  });

  it('create should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      registrationDate: faker.date.past(),
      receta: [],
      listaCompras: [],
      comentarios: []
    };

    const newUsuario: UsuarioEntity = await service.create(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({ where: { id: newUsuario.id } });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.name).toEqual(newUsuario.name);
    expect(storedUsuario.email).toEqual(newUsuario.email);
  });

  it('update should modify a usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    usuario.name = "New name";
    usuario.email = "newemail@example.com";

    const updatedUsuario: UsuarioEntity = await service.update(usuario.id, usuario);
    expect(updatedUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.name).toEqual(usuario.name);
    expect(storedUsuario.email).toEqual(usuario.email);
  });

  it('update should throw an exception for an invalid usuario', async () => {
    let usuario: UsuarioEntity = usuariosList[0];
    usuario = { ...usuario, name: "New name", email: "newemail@example.com" };

    await expect(() => service.update("0", usuario)).rejects.toHaveProperty("message", "The usuario with the given id was not found");
  });

  it('delete should remove a usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.delete(usuario.id);

    const deletedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } });
    expect(deletedUsuario).toBeNull();
  });

  it('delete should throw an exception for an invalid usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.delete(usuario.id);

    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found");
  });
});
