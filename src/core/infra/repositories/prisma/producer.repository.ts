import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { IProducerRepository } from '@domain/repositories/producer-repository.interface';
import { Producer } from '@domain/entities/producer.entity';
import { UpdateProducerDto } from '@app/dto/producer/update-producer.dto';
import { CreateProducerDto } from '@app/dto/producer/create-producer.dto';

@Injectable()
export class PrismaProducerRepository implements IProducerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProducerDto): Promise<Producer> {
    return this.prisma.producer
      .create({
        data: {
          cpfCnpj: data.cpfCnpj,
          name: data.name,
        },
        include: {
          farms: {
            include: {
              crops: true,
            },
          },
        },
      })
      .then(this.toDomainEntity);
  }

  async findAll(): Promise<Producer[]> {
    return this.prisma.producer
      .findMany({
        include: {
          farms: {
            include: {
              crops: true,
            },
          },
        },
      })
      .then(producers => producers.map(this.toDomainEntity));
  }

  async findById(id: number): Promise<Producer | null> {
    return this.prisma.producer
      .findUnique({
        where: { id },
        include: {
          farms: {
            include: {
              crops: true,
            },
          },
        },
      })
      .then(producer => (producer ? this.toDomainEntity(producer) : null));
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Producer | null> {
    return this.prisma.producer
      .findUnique({
        where: { cpfCnpj },
        include: {
          farms: {
            include: {
              crops: true,
            },
          },
        },
      })
      .then(producer => (producer ? this.toDomainEntity(producer) : null));
  }

  async update(id: number, data: UpdateProducerDto): Promise<Producer> {
    return this.prisma.producer
      .update({
        where: { id },
        data: {
          cpfCnpj: data.cpfCnpj,
          name: data.name,
        },
        include: {
          farms: {
            include: {
              crops: true,
            },
          },
        },
      })
      .then(this.toDomainEntity);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.producer.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaProducer: any): Producer {
    return new Producer(
      prismaProducer.id,
      prismaProducer.cpfCnpj,
      prismaProducer.name,
      prismaProducer?.farms?.map(farm => ({
        id: farm?.id,
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        arableArea: farm.arableArea,
        vegetationArea: farm.vegetationArea,
        producerId: farm?.producerId,
        crops: farm?.crops?.map(crop => ({
          id: crop?.id,
          name: crop.name,
          harvest: crop.harvest,
          farmId: crop.farmId,
        })),
      })),
    );
  }
}
