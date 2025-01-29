import { Module } from '@nestjs/common';
import { ProducerModule } from '@presentation/producer/producer.module';
import { DashboardModule } from '@presentation/dashboard/dashboard.module';

@Module({
  imports: [ProducerModule, DashboardModule],
})
export class AppModule {}
