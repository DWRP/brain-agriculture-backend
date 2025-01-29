import { Crop } from './crop.entity';

export class Farm {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly city: string,
    public readonly state: string,
    public readonly totalArea: number,
    public readonly arableArea: number,
    public readonly vegetationArea: number,
    public readonly producerId?: number,
    public readonly crops?: Crop[],
  ) {}
}
