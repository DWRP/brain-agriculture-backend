import { PartialType } from '@nestjs/swagger';
import { CreateProducerDto } from './create-producer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProducerDto extends PartialType(CreateProducerDto) {
  @ApiProperty({
    description: 'List of cultivated crops',
    example: ['SOYBEANS', 'CORN'],
    enum: ['SOYBEANS', 'CORN', 'COTTON', 'COFFEE', 'SUGARCANE'],
    required: false,
  })
  crops?: string[];
}
