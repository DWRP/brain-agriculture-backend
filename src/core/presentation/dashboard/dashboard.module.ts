import { Module } from '@nestjs/common';
import { DashboardService } from '@app/use-cases/dashboard/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { CROP_REPOSITORY } from '@core/domain/repositories/crop-repository.interface';
import { PrismaCropRepository } from '@core/infra/repositories/prisma/crop.repository';
import { FARM_REPOSITORY } from '@core/domain/repositories/farm-repository.interface';
import { PrismaFarmRepository } from '@core/infra/repositories/prisma/farm.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    DashboardService,
    {
      provide: CROP_REPOSITORY,
      useClass: PrismaCropRepository,
    },
    {
      provide: FARM_REPOSITORY,
      useClass: PrismaFarmRepository,
    },
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
