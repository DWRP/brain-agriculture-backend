import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidateTotalArea(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateTotalArea',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value.arableArea + value.vegetationArea <= value.totalArea;
        },
        defaultMessage() {
          return 'A soma das áreas agricultável e vegetação não pode exceder a área total';
        },
      },
    });
  };
}
