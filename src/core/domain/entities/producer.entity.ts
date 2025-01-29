import { Farm } from './farm.entity';

export class Producer {
  constructor(
    public readonly id: number,
    public readonly cpfCnpj: string,
    public readonly name: string,
    public readonly farms?: Farm[],
  ) {}
}
