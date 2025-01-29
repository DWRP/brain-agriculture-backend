import { Inject, Injectable } from '@nestjs/common';
import { DashboardResponseDto } from '@app/dto/dashboard/dashboard-response.dto';
import { FARM_REPOSITORY, IFarmRepository } from '@domain/repositories/farm-repository.interface';
import { CROP_REPOSITORY, ICropRepository } from '@domain/repositories/crop-repository.interface';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(CROP_REPOSITORY)
    private readonly cropRepository: ICropRepository,
  ) {}

  async getDashboardData(): Promise<DashboardResponseDto> {
    const totalFarms = (await this.farmRepository.findByProducer(0)).length;
    const totalHectares = await this.farmRepository.getTotalArea();

    const farms = await this.farmRepository.findByProducer(0);

    const states = farms.reduce(
      (acc, farm) => {
        acc[farm.state] = (acc[farm.state] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    const formattedStates = Object.entries(states).map(([name, value]) => ({ name, value }));

    const crops = await this.cropRepository.countByCrop();
    const formattedCrops = crops.map(({ name, count }) => ({ name, value: count }));

    const landUsage = [
      { name: 'Agricultável', value: farms.reduce((sum, farm) => sum + (farm.arableArea || 0), 0) },
      {
        name: 'Vegetação',
        value: farms.reduce((sum, farm) => sum + (farm.vegetationArea || 0), 0),
      },
    ];

    return {
      totals: {
        farms: totalFarms,
        hectares: totalHectares,
      },
      charts: {
        byState: formattedStates,
        byCrop: formattedCrops,
        landUsage,
      },
    };
  }
}
