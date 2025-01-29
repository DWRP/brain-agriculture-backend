import { IProducerRepository } from '@domain/repositories/producer-repository.interface';
import { Producer } from '@domain/entities/producer.entity';
import { CreateProducerDto } from '@app/dto/producer/create-producer.dto';
import { UpdateProducerDto } from '@app/dto/producer/update-producer.dto';

export class InMemoryProducerRepository implements IProducerRepository {
  private producers: Producer[] = [];
  private currentId = 1;

  async create(data: CreateProducerDto): Promise<Producer> {
    const producer = new Producer(this.currentId++, data.cpfCnpj, data.name, []);
    this.producers.push(producer);
    return producer;
  }

  async findAll(): Promise<Producer[]> {
    return [...this.producers];
  }

  async findById(id: number): Promise<Producer | null> {
    const producer = this.producers.find(p => p.id === id);
    return producer || null;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Producer | null> {
    const producer = this.producers.find(p => p.cpfCnpj === cpfCnpj);
    return producer || null;
  }

  async update(id: number, data: UpdateProducerDto): Promise<Producer> {
    const index = this.producers.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producer not found');

    const updatedProducer = new Producer(
      id,
      data.cpfCnpj || this.producers[index].cpfCnpj,
      data.name || this.producers[index].name,
      this.producers[index].farms,
    );

    this.producers[index] = updatedProducer;
    return updatedProducer;
  }

  async delete(id: number): Promise<void> {
    const index = this.producers.findIndex(p => p.id === id);
    if (index !== -1) {
      this.producers.splice(index, 1);
    }
  }

  // Método auxiliar para testes
  clear(): void {
    this.producers = [];
    this.currentId = 1;
  }
}
