import { ValidateIf, type ValidationOptions } from "class-validator";

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
    return function IsNullableDecorator(prototype: object, propertyKey: string | symbol): void {
        ValidateIf((obj): boolean => null !== obj[propertyKey], options)(prototype, propertyKey);
    };
}
