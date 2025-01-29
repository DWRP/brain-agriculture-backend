import { CreateFarmDto } from '@app/dto/producer/create-producer.dto';
import { Farm } from '@domain/entities/farm.entity';

export const FARM_REPOSITORY = Symbol('FARM_REPOSITORY');

export interface IFarmRepository {
  create(farm: CreateFarmDto, producerId: number): Promise<Farm>;
  findByProducer(producerId: number): Promise<Farm[]>;
  getTotalArea(): Promise<number>;
  update(id: number, farm: Partial<Farm>): Promise<Farm>;
  delete(id: number): Promise<void>;
  deleteByProducer(producerId: number): Promise<void>;
}
