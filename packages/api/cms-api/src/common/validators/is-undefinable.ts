import { ValidateIf, type ValidationOptions } from "class-validator";

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
    return function IsUndefinableDecorator(prototype: object, propertyKey: string | symbol): void {
        ValidateIf((obj): boolean => undefined !== obj[propertyKey], options)(prototype, propertyKey);
    };
}
