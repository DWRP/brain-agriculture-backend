import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { ICropRepository } from '@domain/repositories/crop-repository.interface';
import { Crop } from '@domain/entities/crop.entity';
import { CreateCropDto } from '@app/dto/producer/create-producer.dto';

@Injectable()
export class PrismaCropRepository implements ICropRepository {
  constructor(private readonly prisma: PrismaService) {}

  async bulkCreate(crops: CreateCropDto[], farmId: number): Promise<void> {
    await this.prisma.crop.createMany({
      data: crops.map(crop => ({
        name: crop.name,
        harvest: crop.harvest,
        farmId: farmId,
      })),
    });
  }

  async deleteByFarm(farmId: number): Promise<void> {
    await this.prisma.crop.deleteMany({
      where: { farmId },
    });
  }

  async countByCrop(): Promise<{ name: string; count: number }[]> {
    return this.prisma.crop
      .groupBy({
        by: ['name'],
        _count: {
          name: true,
        },
        orderBy: {
          _count: {
            name: 'desc',
          },
        },
      })
      .then(results =>
        results.map(result => ({
          name: result.name,
          count: result._count.name,
        })),
      );
  }

  async findByFarm(farmId: number): Promise<Crop[]> {
    return this.prisma.crop.findMany({
      where: { farmId },
    });
  }
}
