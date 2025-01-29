import { UpdateProducerDto } from '@app/dto/producer/update-producer.dto';
import { Producer } from '@domain/entities/producer.entity';
import { CreateProducerDto } from '@app/dto/producer/create-producer.dto';

export const PRODUCER_REPOSITORY = Symbol('PRODUCER_REPOSITORY');

export interface IProducerRepository {
  create(data: CreateProducerDto): Promise<Producer>;
  findByCpfCnpj(cpfCnpj: string): Promise<Producer | null>;
  findAll(): Promise<Producer[]>;
  findById(id: number): Promise<Producer | null>;
  update(id: number, data: Partial<UpdateProducerDto>): Promise<Producer>;
  delete(id: number): Promise<void>;
}
