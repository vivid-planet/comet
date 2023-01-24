import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ValidationArguments } from "class-validator/types/validation/ValidationArguments";

import { DamConfig } from "../../dam.config";
import { DAM_CONFIG } from "../../dam.constants";

export const IsAllowedImageSize = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsAllowedImageSizeConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsAllowedImageSize" })
@Injectable()
export class IsAllowedImageSizeConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(DAM_CONFIG) private readonly config: DamConfig) {}

    validate(value: number): boolean {
        return this.config.allowedImageSizes.includes(value);
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        return `${validationArguments.property} is not allowed`;
    }
}
