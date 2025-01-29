import { CreateCropDto } from '@app/dto/producer/create-producer.dto';
import { Crop } from '@domain/entities/crop.entity';

export const CROP_REPOSITORY = Symbol('CROP_REPOSITORY');

export interface ICropRepository {
  bulkCreate(crops: CreateCropDto[], farmId: number): Promise<void>;
  deleteByFarm(farmId: number): Promise<void>;
  countByCrop(): Promise<{ name: string; count: number }[]>;
  findByFarm(farmId: number): Promise<Crop[]>;
}
