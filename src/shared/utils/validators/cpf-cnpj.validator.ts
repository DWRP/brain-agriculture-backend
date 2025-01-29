import { isCNPJ, isCPF } from 'brazilian-values';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidCpfCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidCpfCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return isCPF(value) || isCNPJ(value);
        },

        defaultMessage(): string {
          return 'CPF/CNPJ inválido. Use o formato 000.000.000-00 ou 00.000.000/0000-00';
        },
      },
    });
  };
}
