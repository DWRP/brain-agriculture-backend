import { Module } from '@nestjs/common';
import { DashboardService } from '@/app/use-cases/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '@/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
