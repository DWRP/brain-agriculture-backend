import { Module } from '@nestjs/common';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { PrismaProducerRepository } from '@infra/repositories/prisma/producer.repository';
import { ProducerController } from './producer.controller';
import { ProducerService } from '@app/use-cases/producer/producer.service';
import { PRODUCER_REPOSITORY } from '@domain/repositories/producer-repository.interface';
import { PrismaCropRepository } from '@infra/repositories/prisma/crop.repository';
import { CROP_REPOSITORY } from '@domain/repositories/crop-repository.interface';
import { FARM_REPOSITORY } from '@domain/repositories/farm-repository.interface';
import { PrismaFarmRepository } from '@infra/repositories/prisma/farm.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerController],
  providers: [
    ProducerService,
    {
      provide: PRODUCER_REPOSITORY,
      useClass: PrismaProducerRepository,
    },
    {
      provide: CROP_REPOSITORY,
      useClass: PrismaCropRepository,
    },
    {
      provide: FARM_REPOSITORY,
      useClass: PrismaFarmRepository,
    },
  ],
  exports: [ProducerService],
})
export class ProducerModule {}
