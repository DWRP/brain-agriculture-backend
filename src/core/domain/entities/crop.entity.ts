export class Crop {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly harvest: string,
    public readonly farmId?: number,
  ) {}
}
