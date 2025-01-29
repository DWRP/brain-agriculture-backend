import { Test, TestingModule } from '@nestjs/testing';
import { ICropRepository, CROP_REPOSITORY } from '@domain/repositories/crop-repository.interface';
import { CreateCropDto, CropName } from '@app/dto/producer/create-producer.dto';
import { InMemoryCropRepository } from '@infra/repositories/memory/crop.repository';

describe('CropRepository', () => {
  let cropRepository: ICropRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CROP_REPOSITORY, useClass: InMemoryCropRepository }],
    }).compile();

    cropRepository = module.get<ICropRepository>(CROP_REPOSITORY);
  });

  it('should bulk create crops', async () => {
    const crops: CreateCropDto[] = [
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.CORN, harvest: '2024' },
    ];
    await cropRepository.bulkCreate(crops, 1);
    const cropsInDb = await cropRepository.findByFarm(1);
    expect(cropsInDb).toHaveLength(2);
  });

  it('should find crops by farm', async () => {
    const crops: CreateCropDto[] = [
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.CORN, harvest: '2024' },
    ];
    await cropRepository.bulkCreate(crops, 1);
    const cropsInDb = await cropRepository.findByFarm(1);
    expect(cropsInDb).toHaveLength(2);
  });

  it('should count crops', async () => {
    const crops: CreateCropDto[] = [
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.CORN, harvest: '2024' },
      { name: CropName.SOYBEANS, harvest: '2024' },
    ];
    await cropRepository.bulkCreate(crops, 1);
    const cropCount = await cropRepository.countByCrop();
    expect(cropCount).toEqual([
      { name: CropName.SOYBEANS, count: 2 },
      { name: CropName.CORN, count: 1 },
    ]);
  });

  it('should delete crops by farm', async () => {
    const crops: CreateCropDto[] = [
      { name: CropName.SOYBEANS, harvest: '2024' },
      { name: CropName.CORN, harvest: '2024' },
    ];
    await cropRepository.bulkCreate(crops, 1);
    await cropRepository.deleteByFarm(1);
    const cropsInDb = await cropRepository.findByFarm(1);
    expect(cropsInDb).toHaveLength(0);
  });
});
