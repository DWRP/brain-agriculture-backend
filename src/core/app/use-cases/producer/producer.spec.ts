import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { InMemoryProducerRepository } from '@infra/repositories/memory/producer.repository';
import { InMemoryCropRepository } from '@infra/repositories/memory/crop.repository';
import { InMemoryFarmRepository } from '@infra/repositories/memory/farm.repository';
import { CreateProducerDto, CropName } from '@app/dto/producer/create-producer.dto';
import { UpdateProducerDto } from '@app/dto/producer/update-producer.dto';
import { PRODUCER_REPOSITORY } from '@domain/repositories/producer-repository.interface';
import { FARM_REPOSITORY } from '@domain/repositories/farm-repository.interface';
import { CROP_REPOSITORY } from '@domain/repositories/crop-repository.interface';

describe('ProducerService', () => {
  let service: ProducerService;
  let producerRepository: InMemoryProducerRepository;
  let farmRepository: InMemoryFarmRepository;
  let cropRepository: InMemoryCropRepository;

  beforeEach(async () => {
    producerRepository = new InMemoryProducerRepository();
    farmRepository = new InMemoryFarmRepository();
    cropRepository = new InMemoryCropRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: PRODUCER_REPOSITORY,
          useValue: producerRepository,
        },
        {
          provide: FARM_REPOSITORY,
          useValue: farmRepository,
        },
        {
          provide: CROP_REPOSITORY,
          useValue: cropRepository,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
  });

  afterEach(() => {
    producerRepository.clear();
    farmRepository.clear();
    cropRepository.clear();
  });

  const mockCreateProducerDto: CreateProducerDto = {
    cpfCnpj: '12345678901',
    name: 'Test Producer',
    farms: [
      {
        name: 'Test Farm',
        city: 'Test City',
        state: 'TS',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 400,
        crops: [
          { name: CropName.SOYBEANS, harvest: '2024' },
          { name: CropName.CORN, harvest: '2024' },
        ],
      },
    ],
  };

  describe('createProducer', () => {
    it('should create a producer with farms and crops successfully', async () => {
      const result = await service.createProducer(mockCreateProducerDto);

      expect(result).toBeDefined();
      expect(result.cpfCnpj).toBe(mockCreateProducerDto.cpfCnpj);
      expect(result.name).toBe(mockCreateProducerDto.name);

      const farms = await farmRepository.findByProducer(result.id);
      expect(farms).toHaveLength(1);
      expect(farms[0].name).toBe(mockCreateProducerDto.farms[0].name);

      const crops = await cropRepository.findByFarm(farms[0].id);
      expect(crops).toHaveLength(2);
    });

    it('should throw ConflictException when CPF/CNPJ already exists', async () => {
      await service.createProducer(mockCreateProducerDto);

      await expect(service.createProducer(mockCreateProducerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when farm areas are invalid', async () => {
      const invalidDto = {
        ...mockCreateProducerDto,
        farms: [
          {
            ...mockCreateProducerDto.farms[0],
            totalArea: 500,
            arableArea: 300,
            vegetationArea: 300,
          },
        ],
      };

      await expect(service.createProducer(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllProducers', () => {
    it('should return all producers', async () => {
      await service.createProducer(mockCreateProducerDto);
      await service.createProducer({
        ...mockCreateProducerDto,
        cpfCnpj: '98765432101',
      });

      const results = await service.findAllProducers();
      expect(results).toHaveLength(2);
    });

    it('should return empty array when no producers exist', async () => {
      const results = await service.findAllProducers();
      expect(results).toHaveLength(0);
    });
  });

  describe('findProducerById', () => {
    it('should return producer when found', async () => {
      const created = await service.createProducer(mockCreateProducerDto);
      const found = await service.findProducerById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException when producer not found', async () => {
      await expect(service.findProducerById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProducer', () => {
    let createdProducer;

    beforeEach(async () => {
      createdProducer = await service.createProducer(mockCreateProducerDto);
    });

    const updateDto: UpdateProducerDto = {
      name: 'Updated Producer',
      farms: [
        {
          name: 'Updated Farm',
          city: 'Updated City',
          state: 'TS',
          totalArea: 2000,
          arableArea: 1200,
          vegetationArea: 800,
          crops: [{ name: CropName.COFFEE, harvest: '2024' }],
        },
      ],
    };

    it('should update producer successfully', async () => {
      const updated = await service.updateProducer(createdProducer.id, updateDto);

      expect(updated.name).toBe(updateDto.name);

      const farms = await farmRepository.findByProducer(updated.id);
      expect(farms).toHaveLength(1);
      expect(farms[0].name).toBe(updateDto.farms[0].name);
    });

    it('should throw ConflictException when updating to existing CPF/CNPJ', async () => {
      await service.createProducer({
        ...mockCreateProducerDto,
        cpfCnpj: '98765432101',
      });

      const conflictUpdateDto = {
        ...updateDto,
        cpfCnpj: '98765432101',
      };

      await expect(service.updateProducer(createdProducer.id, conflictUpdateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when updating with invalid farm areas', async () => {
      const invalidUpdateDto = {
        ...updateDto,
        farms: [
          {
            ...updateDto.farms[0],
            totalArea: 500,
            arableArea: 300,
            vegetationArea: 300,
          },
        ],
      };

      await expect(service.updateProducer(createdProducer.id, invalidUpdateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteProducer', () => {
    it('should delete producer and related data successfully', async () => {
      const created = await service.createProducer(mockCreateProducerDto);

      await service.deleteProducer(created.id);

      await expect(service.findProducerById(created.id)).rejects.toThrow(NotFoundException);

      const farms = await farmRepository.findByProducer(created.id);
      expect(farms).toHaveLength(0);
    });

    it('should throw NotFoundException when deleting non-existent producer', async () => {
      await expect(service.deleteProducer(999)).rejects.toThrow(NotFoundException);
    });
  });
});
