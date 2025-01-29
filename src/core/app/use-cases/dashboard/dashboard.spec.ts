import { Test, TestingModule } from '@nestjs/testing';
import { DashboardResponseDto } from '@app/dto/dashboard/dashboard-response.dto';
import { FARM_REPOSITORY } from '@domain/repositories/farm-repository.interface';
import { CROP_REPOSITORY } from '@domain/repositories/crop-repository.interface';
import { DashboardService } from './dashboard.service';
import { InMemoryFarmRepository } from '@infra/repositories/memory/farm.repository';
import { InMemoryCropRepository } from '@infra/repositories/memory/crop.repository';
import { CreateFarmDto } from '@app/dto/producer/create-producer.dto';
import { CreateCropDto } from '@app/dto/producer/create-producer.dto';
import { CropName } from '@app/dto/producer/create-producer.dto';

describe('DashboardService', () => {
  let service: DashboardService;
  let farmRepository: InMemoryFarmRepository;
  let cropRepository: InMemoryCropRepository;

  beforeEach(async () => {
    farmRepository = new InMemoryFarmRepository();
    cropRepository = new InMemoryCropRepository();

    // Criando fazendas
    const farm1: CreateFarmDto = {
      name: 'Fazenda Esperança',
      city: 'Rio Verde',
      state: 'SP',
      totalArea: 1000,
      arableArea: 800,
      vegetationArea: 200,
      crops: [
        { name: CropName.SOYBEANS, harvest: '2024' },
        { name: CropName.CORN, harvest: '2024' },
      ],
    };
    const farm2: CreateFarmDto = {
      name: 'Fazenda Campo Verde',
      city: 'Uberlândia',
      state: 'MG',
      totalArea: 1500,
      arableArea: 1000,
      vegetationArea: 500,
      crops: [
        { name: CropName.SOYBEANS, harvest: '2024' },
        { name: CropName.CORN, harvest: '2024' },
        { name: CropName.SUGARCANE, harvest: '2024' },
      ],
    };

    // Inserindo as fazendas no repositório
    await farmRepository.create(farm1, 0); // ProducerId = 0
    await farmRepository.create(farm2, 0);

    // Criando culturas (já associadas com as fazendas)
    const crops: CreateCropDto[] = [
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.CORN, harvest: '2024' },
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.CORN, harvest: '2024' },
      { name: CropName.SUGARCANE, harvest: '2024' },
    ];

    await cropRepository.bulkCreate(crops, 1); // Associado a fazenda 1
    await cropRepository.bulkCreate(crops, 2); // Associado a fazenda 2

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: FARM_REPOSITORY, useValue: farmRepository },
        { provide: CROP_REPOSITORY, useValue: cropRepository },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    farmRepository.clear();
    cropRepository.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard data correctly', async () => {
    const result: DashboardResponseDto = await service.getDashboardData();

    expect(result).toEqual({
      totals: {
        farms: 2,
        hectares: 2500,
      },
      charts: {
        byState: [
          { name: 'SP', value: 1 },
          { name: 'MG', value: 1 },
        ],
        byCrop: [
          { name: 'SOYBEANS', value: 6 },
          { name: 'CORN', value: 4 },
          { name: 'SUGARCANE', value: 2 },
        ],
        landUsage: [
          { name: 'Agricultável', value: 1800 },
          { name: 'Vegetação', value: 700 },
        ],
      },
    });
  });
});
