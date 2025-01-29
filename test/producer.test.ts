import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProducerController } from '@presentation/producer/producer.controller';
import { ProducerService } from '@app/use-cases/producer/producer.service';
import { Producer } from '@domain/entities/producer.entity';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  const producerService = {
    createProducer: jest.fn(),
    findAllProducers: jest.fn(),
    findProducerById: jest.fn(),
    updateProducer: jest.fn(),
    deleteProducer: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: producerService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new producer', async () => {
    const createProducerDto = {
      cpfCnpj: '69615491012',
      name: 'Producer Test',
      farms: [],
    } as Producer;

    const producer: Producer = {
      id: 1,
      ...createProducerDto,
    };

    producerService.createProducer.mockResolvedValue(producer);

    return request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(201)
      .expect(response => {
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe('Producer Test');
      });
  });

  it('should return 400 if CPF/CNPJ is invalid', async () => {
    const createProducerDto = {
      cpfCnpj: 'invalid-cpf',
      name: 'Invalid Producer',
      farms: [],
    };

    return request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(400)
      .expect(response => {
        expect(response.body.message).toContain('CPF/CNPJ inválido');
      });
  });

  it('should get all producers', async () => {
    const producers: Producer[] = [
      { id: 1, name: 'Producer 1', cpfCnpj: '69615491012' },
      { id: 2, name: 'Producer 2', cpfCnpj: '08856077086' },
    ];

    producerService.findAllProducers.mockResolvedValue(producers);

    return request(app.getHttpServer())
      .get('/producers')
      .expect(200)
      .expect(response => {
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('Producer 1');
      });
  });

  it('should get a producer by id', async () => {
    const producer: Producer = {
      id: 1,
      name: 'Producer Test',
      cpfCnpj: '69615491012',
    };

    producerService.findProducerById.mockResolvedValue(producer);

    return request(app.getHttpServer())
      .get('/producers/1')
      .expect(200)
      .expect(response => {
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe('Producer Test');
      });
  });

  it('should update a producer', async () => {
    const updateProducerDto = { name: 'Updated Producer' } as Producer;

    const updatedProducer: Producer = {
      id: 1,
      ...updateProducerDto,
      cpfCnpj: '69615491012',
    };

    producerService.updateProducer.mockResolvedValue(updatedProducer);

    return request(app.getHttpServer())
      .put('/producers/1')
      .send(updateProducerDto)
      .expect(200)
      .expect(response => {
        expect(response.body.name).toBe('Updated Producer');
      });
  });

  it('should delete a producer', async () => {
    producerService.deleteProducer.mockResolvedValue(undefined);

    return request(app.getHttpServer()).delete('/producers/1').expect(204); // Status code 204 para deleção bem-sucedida
  });
});
