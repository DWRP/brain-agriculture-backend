import { CreateFarmDto } from '@app/dto/producer/create-producer.dto';
import { Farm } from '@domain/entities/farm.entity';
import { IFarmRepository } from '@domain/repositories/farm-repository.interface';

export class InMemoryFarmRepository implements IFarmRepository {
  private farms: Farm[] = [];
  private currentId = 1;

  async create(farm: CreateFarmDto, producerId: number): Promise<Farm> {
    const newFarm: Farm = {
      id: this.currentId++,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      producerId: producerId,
      crops: [],
    };
    this.farms.push(newFarm);
    return newFarm;
  }

  async update(id: number, farm: Farm): Promise<Farm> {
    const index = this.farms.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Farm not found');

    this.farms[index] = { ...farm, id };
    return this.farms[index];
  }

  async delete(id: number): Promise<void> {
    const index = this.farms.findIndex(f => f.id === id);
    if (index !== -1) {
      this.farms.splice(index, 1);
    }
  }

  async deleteByProducer(producerId: number): Promise<void> {
    this.farms = this.farms.filter(f => f.producerId !== producerId);
  }

  async findByProducer(producerId: number): Promise<Farm[]> {
    return this.farms.filter(f => f.producerId === producerId);
  }

  async getTotalArea(): Promise<number> {
    return this.farms.reduce((sum, farm) => sum + farm.totalArea, 0);
  }

  // Método auxiliar para testes
  clear(): void {
    this.farms = [];
    this.currentId = 1;
  }
}
