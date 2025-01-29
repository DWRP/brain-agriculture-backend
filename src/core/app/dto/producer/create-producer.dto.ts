import { IsValidCpfCnpj } from '@/shared/utils/validators/cpf-cnpj.validator';
import { IsValidState } from '@/shared/utils/validators/state.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum CropName {
  SOYBEANS = 'SOYBEANS',
  CORN = 'CORN',
  COTTON = 'COTTON',
  COFFEE = 'COFFEE',
  SUGARCANE = 'SUGARCANE',
}

export class CreateCropDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'SOYBEANS',
    enum: CropName,
    required: true,
  })
  @IsEnum(CropName, { message: 'Nome da cultura inválido' })
  @IsNotEmpty({ message: 'O nome da cultura é obrigatório' })
  readonly name: CropName;

  @ApiProperty({
    description: 'Data ou ano da colheita (formato livre)',
    example: '2024',
    required: true,
  })
  @IsString({ message: 'A colheita deve ser uma string' })
  @IsNotEmpty({ message: 'A colheita é obrigatória' })
  readonly harvest: string;

  @ApiProperty({
    description: 'ID da fazenda (gerado automaticamente)',
    required: false,
    readOnly: true,
  })
  readonly farmId?: number;
}

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da propriedade rural',
    example: 'Fazenda Esperança',
    required: true,
  })
  @IsString({ message: 'O nome da fazenda deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da fazenda é obrigatório' })
  @MinLength(3, { message: 'O nome da fazenda deve ter pelo menos 3 caracteres' })
  readonly name: string;

  @ApiProperty({
    description: 'Cidade onde está localizada a propriedade',
    example: 'Rio Verde',
    required: true,
  })
  @IsString({ message: 'A cidade deve ser uma string' })
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @MinLength(3, { message: 'A cidade deve ter pelo menos 3 caracteres' })
  readonly city: string;

  @ApiProperty({
    description: 'Estado (UF) com 2 caracteres',
    example: 'GO',
    minLength: 2,
    maxLength: 2,
    required: true,
  })
  @IsString({ message: 'O estado deve ser uma string' })
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @IsValidState({ message: 'Estado inválido. Use a sigla de 2 caracteres (ex: SP, MG)' })
  readonly state: string;

  @ApiProperty({
    description: 'Área total em hectares',
    example: 1000,
    minimum: 0,
    required: true,
  })
  @IsNumber({}, { message: 'A área total deve ser um número' })
  @IsPositive({ message: 'A área total deve ser maior que zero' })
  readonly totalArea: number;

  @ApiProperty({
    description: 'Área agricultável em hectares',
    example: 700,
    minimum: 0,
    required: true,
  })
  @IsNumber({}, { message: 'A área agricultável deve ser um número' })
  @IsPositive({ message: 'A área agricultável deve ser maior que zero' })
  readonly arableArea: number;

  @ApiProperty({
    description: 'Área de vegetação em hectares',
    example: 300,
    minimum: 0,
    required: true,
  })
  @IsNumber({}, { message: 'A área de vegetação deve ser um número' })
  @IsPositive({ message: 'A área de vegetação deve ser maior que zero' })
  readonly vegetationArea: number;

  @ApiProperty({
    description: 'ID do produtor (gerado automaticamente)',
    required: false,
    readOnly: true,
  })
  readonly producerId?: number;

  @ApiProperty({
    description: 'Cultivos da propriedade',
    type: [CreateCropDto],
    required: true,
  })
  @IsArray({ message: 'As culturas devem ser fornecidas como uma lista' })
  @ValidateNested({ each: true, message: 'Cada cultura deve ser válida' })
  @Type(() => CreateCropDto)
  readonly crops: CreateCropDto[];
}

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor (formato: 000.000.000-00 ou 00.000.000/0000-00)',
    example: '123.456.789-09',
    required: true,
  })
  @IsString({ message: 'CPF/CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CPF/CNPJ é obrigatório' })
  @IsValidCpfCnpj({ message: 'CPF/CNPJ inválido' })
  readonly cpfCnpj: string;

  @ApiProperty({
    description: 'Nome completo do produtor rural',
    example: 'João Silva Agricola LTDA',
    required: true,
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  readonly name: string;

  @ApiProperty({
    description: 'Lista de propriedades rurais',
    type: [CreateFarmDto],
    required: false,
  })
  @IsArray({ message: 'As fazendas devem ser fornecidas como uma lista' })
  @ValidateNested({ each: true, message: 'Cada fazenda deve ser válida' })
  @Type(() => CreateFarmDto)
  readonly farms?: CreateFarmDto[];
}
