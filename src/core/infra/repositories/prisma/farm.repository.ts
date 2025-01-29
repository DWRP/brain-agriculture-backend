import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { IFarmRepository } from '@domain/repositories/farm-repository.interface';
import { Farm } from '@domain/entities/farm.entity';
import { CreateFarmDto } from '@app/dto/producer/create-producer.dto';

@Injectable()
export class PrismaFarmRepository implements IFarmRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(farm: CreateFarmDto, producerId: number): Promise<Farm> {
    return this.prisma.farm.create({
      data: {
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        arableArea: farm.arableArea,
        vegetationArea: farm.vegetationArea,
        producerId: producerId,
        crops: {
          create: farm.crops,
        },
      },
      include: {
        crops: true,
      },
    });
  }

  async update(id: number, farm: Farm): Promise<Farm> {
    return this.prisma.farm.update({
      where: { id },
      data: {
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        arableArea: farm.arableArea,
        vegetationArea: farm.vegetationArea,
        crops: {
          deleteMany: {},
          create: farm.crops,
        },
      },
      include: {
        crops: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.farm.delete({
      where: { id },
    });
  }

  async deleteByProducer(producerId: number): Promise<void> {
    await this.prisma.farm.deleteMany({
      where: { producerId },
    });
  }

  async findByProducer(producerId: number): Promise<Farm[]> {
    return this.prisma.farm.findMany({
      where: { producerId },
      include: {
        crops: true,
      },
    });
  }

  async getTotalArea(): Promise<number> {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
      },
    });
    return result._sum.totalArea || 0;
  }
}
