import { CreateCropDto } from '@app/dto/producer/create-producer.dto';
import { Crop } from '@domain/entities/crop.entity';
import { ICropRepository } from '@domain/repositories/crop-repository.interface';

export class InMemoryCropRepository implements ICropRepository {
  private crops: Crop[] = [];
  private currentId = 1;

  async bulkCreate(crops: CreateCropDto[], farmId: number): Promise<void> {
    const newCrops = crops.map(crop => ({
      id: this.currentId++,
      name: crop.name,
      harvest: crop.harvest,
      farmId: farmId,
    }));

    this.crops.push(...newCrops);
  }

  async deleteByFarm(farmId: number): Promise<void> {
    this.crops = this.crops.filter(c => c.farmId !== farmId);
  }

  async countByCrop(): Promise<{ name: string; count: number }[]> {
    const countMap = new Map<string, number>();

    this.crops.forEach(crop => {
      const currentCount = countMap.get(crop.name) || 0;
      countMap.set(crop.name, currentCount + 1);
    });

    return Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async findByFarm(farmId: number): Promise<Crop[]> {
    return this.crops.filter(c => c.farmId === farmId);
  }

  // Método auxiliar para testes
  clear(): void {
    this.crops = [];
    this.currentId = 1;
  }
}
