import { Test, TestingModule } from '@nestjs/testing';
import { IFarmRepository, FARM_REPOSITORY } from '@domain/repositories/farm-repository.interface';
import { CreateFarmDto } from '@app/dto/producer/create-producer.dto';
import { InMemoryFarmRepository } from '@infra/repositories/memory/farm.repository';

describe('FarmRepository', () => {
  let farmRepository: IFarmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: FARM_REPOSITORY, useClass: InMemoryFarmRepository }],
    }).compile();

    farmRepository = module.get<IFarmRepository>(FARM_REPOSITORY);
  });

  it('should create a farm', async () => {
    const createDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City 1',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 200,
      crops: [],
    };
    const farm = await farmRepository.create(createDto, 1);
    expect(farm).toBeDefined();
    expect(farm.name).toBe(createDto.name);
  });

  it('should find farms by producer', async () => {
    const createDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City 1',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 200,
      crops: [],
    };
    await farmRepository.create(createDto, 1);
    const farms = await farmRepository.findByProducer(1);
    expect(farms).toHaveLength(1);
    expect(farms[0].name).toBe(createDto.name);
  });

  it('should get total area', async () => {
    const createDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City 1',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 200,
      crops: [],
    };
    await farmRepository.create(createDto, 1);
    const totalArea = await farmRepository.getTotalArea();
    expect(totalArea).toBe(500);
  });

  it('should update a farm', async () => {
    const createDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City 1',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 200,
      crops: [],
    };
    const farm = await farmRepository.create(createDto, 1);
    const updatedFarm = await farmRepository.update(farm.id, { name: 'Updated Farm' });
    expect(updatedFarm).toBeDefined();
    expect(updatedFarm.name).toBe('Updated Farm');
  });

  it('should delete a farm', async () => {
    const createDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City 1',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 200,
      crops: [],
    };
    const farm = await farmRepository.create(createDto, 1);
    await farmRepository.delete(farm.id);
    const foundFarm = await farmRepository.findByProducer(1);
    expect(foundFarm).toHaveLength(0);
  });
});
