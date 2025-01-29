import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProducerService } from '@app/use-cases/producer/producer.service';
import { CreateProducerDto } from '@app/dto/producer/create-producer.dto';
import { UpdateProducerDto } from '@app/dto/producer/update-producer.dto';
import { Producer } from '@domain/entities/producer.entity';

@ApiTags('Producers')
@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new producer' })
  @ApiResponse({ status: 201, description: 'Producer created successfully', type: Producer })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
    return this.producerService.createProducer(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all producers' })
  @ApiResponse({ status: 200, description: 'List of producers', type: [Producer] })
  async findAll(): Promise<Producer[]> {
    return this.producerService.findAllProducers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a producer by ID' })
  @ApiResponse({ status: 200, description: 'Producer found', type: Producer })
  @ApiResponse({ status: 404, description: 'Producer not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Producer> {
    return this.producerService.findProducerById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update a producer' })
  @ApiResponse({ status: 200, description: 'Producer updated successfully', type: Producer })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Producer not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    return this.producerService.updateProducer(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a producer' })
  @ApiResponse({ status: 204, description: 'Producer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Producer not found' })
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.producerService.deleteProducer(id);
  }
}
