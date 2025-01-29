import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IProducerRepository,
  PRODUCER_REPOSITORY,
} from '@domain/repositories/producer-repository.interface';
import { FARM_REPOSITORY, IFarmRepository } from '@domain/repositories/farm-repository.interface';
import { CROP_REPOSITORY, ICropRepository } from '@domain/repositories/crop-repository.interface';
import { CreateProducerDto } from '@app/dto/producer/create-producer.dto';
import { UpdateProducerDto } from '@app/dto/producer/update-producer.dto';
import { Producer } from '@domain/entities/producer.entity';

@Injectable()
export class ProducerService {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository,
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(CROP_REPOSITORY)
    private readonly cropRepository: ICropRepository,
  ) {}

  private validateAreas(farm: { totalArea: number; arableArea: number; vegetationArea: number }) {
    if (farm.arableArea + farm.vegetationArea > farm.totalArea) {
      throw new BadRequestException(
        'A soma das áreas agricultável e vegetação não pode exceder a área total',
      );
    }
  }

  async createProducer(createProducerDto: CreateProducerDto): Promise<Producer> {
    const existingProducer = await this.producerRepository.findByCpfCnpj(createProducerDto.cpfCnpj);

    if (existingProducer) {
      throw new ConflictException('CPF/CNPJ já cadastrado');
    }

    createProducerDto.farms.forEach(farm => this.validateAreas(farm));

    const producer = await this.producerRepository.create({
      cpfCnpj: createProducerDto.cpfCnpj,
      name: createProducerDto.name,
    });

    for (const farmDto of createProducerDto.farms) {
      const farm = await this.farmRepository.create(farmDto, producer.id);
      await this.cropRepository.bulkCreate(farmDto.crops, farm.id);
    }

    return this.producerRepository.findById(producer.id);
  }

  async findAllProducers(): Promise<Producer[]> {
    return this.producerRepository.findAll();
  }

  async findProducerById(id: number): Promise<Producer> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    return producer;
  }

  async updateProducer(id: number, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const existingProducer = await this.findProducerById(id);

    if (updateProducerDto.cpfCnpj && updateProducerDto.cpfCnpj !== existingProducer.cpfCnpj) {
      const conflict = await this.producerRepository.findByCpfCnpj(updateProducerDto.cpfCnpj);
      if (conflict) throw new ConflictException('Novo CPF/CNPJ já está em uso');
    }

    await this.farmRepository.deleteByProducer(id);

    await this.producerRepository.update(id, updateProducerDto);

    for (const farmDto of updateProducerDto.farms) {
      this.validateAreas(farmDto);
      const farm = await this.farmRepository.create(farmDto, id);
      await this.cropRepository.bulkCreate(farmDto.crops, farm.id);
    }

    return this.producerRepository.findById(id);
  }

  async deleteProducer(id: number): Promise<void> {
    await this.findProducerById(id);
    await this.farmRepository.deleteByProducer(id);
    await this.producerRepository.delete(id);
  }
}
