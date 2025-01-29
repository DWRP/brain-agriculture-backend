import { Test, TestingModule } from '@nestjs/testing';
import {
  IProducerRepository,
  PRODUCER_REPOSITORY,
} from '@domain/repositories/producer-repository.interface';
import { CreateProducerDto } from '@app/dto/producer/create-producer.dto';
import { InMemoryProducerRepository } from '@infra/repositories/memory/producer.repository';

describe('ProducerRepository', () => {
  let producerRepository: IProducerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PRODUCER_REPOSITORY, useClass: InMemoryProducerRepository }],
    }).compile();

    producerRepository = module.get<IProducerRepository>(PRODUCER_REPOSITORY);
  });

  it('should create a producer', async () => {
    const createDto: CreateProducerDto = { cpfCnpj: '12345678901234', name: 'John Doe' };
    const producer = await producerRepository.create(createDto);
    expect(producer).toBeDefined();
    expect(producer.name).toBe(createDto.name);
  });

  it('should find a producer by CPF/CNPJ', async () => {
    const createDto: CreateProducerDto = { cpfCnpj: '12345678901234', name: 'John Doe' };
    const producer = await producerRepository.create(createDto);
    const foundProducer = await producerRepository.findByCpfCnpj(producer.cpfCnpj);
    expect(foundProducer).toBeDefined();
    expect(foundProducer?.cpfCnpj).toBe(producer.cpfCnpj);
  });

  it('should return null when producer not found by CPF/CNPJ', async () => {
    const producer = await producerRepository.findByCpfCnpj('invalid-cpf-cnpj');
    expect(producer).toBeNull();
  });

  it('should update a producer', async () => {
    const createDto: CreateProducerDto = { cpfCnpj: '12345678901234', name: 'John Doe' };
    const producer = await producerRepository.create(createDto);
    const updatedProducer = await producerRepository.update(producer.id, { name: 'Jane Doe' });
    expect(updatedProducer).toBeDefined();
    expect(updatedProducer.name).toBe('Jane Doe');
  });

  it('should delete a producer', async () => {
    const createDto: CreateProducerDto = { cpfCnpj: '12345678901234', name: 'John Doe' };
    const producer = await producerRepository.create(createDto);
    await producerRepository.delete(producer.id);
    const foundProducer = await producerRepository.findById(producer.id);
    expect(foundProducer).toBeNull();
  });
});
