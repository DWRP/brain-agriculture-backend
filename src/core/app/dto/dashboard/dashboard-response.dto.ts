import { ApiProperty } from '@nestjs/swagger';

class ChartItemDto {
  @ApiProperty({ example: 'SP', description: 'Nome do item' })
  name: string;

  @ApiProperty({ example: 15, description: 'Valor numérico' })
  value: number;
}

class TotalsDto {
  @ApiProperty({ example: 42, description: 'Total de fazendas' })
  farms: number;

  @ApiProperty({ example: 15000, description: 'Total de hectares' })
  hectares: number;
}

class ChartsDto {
  @ApiProperty({ type: [ChartItemDto], description: 'Distribuição por estado' })
  byState: ChartItemDto[];

  @ApiProperty({ type: [ChartItemDto], description: 'Distribuição por cultura' })
  byCrop: ChartItemDto[];

  @ApiProperty({ type: [ChartItemDto], description: 'Uso do solo' })
  landUsage: ChartItemDto[];
}

export class DashboardResponseDto {
  @ApiProperty({ type: TotalsDto })
  totals: TotalsDto;

  @ApiProperty({ type: ChartsDto })
  charts: ChartsDto;
}
