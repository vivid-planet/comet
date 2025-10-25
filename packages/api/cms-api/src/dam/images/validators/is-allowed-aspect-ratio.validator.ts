import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { type DamConfig } from "../../dam.config";
import { DAM_CONFIG } from "../../dam.constants";

export const IsAllowedImageAspectRatio = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsAllowedImageAspectRatioConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsAllowedImageAspectRatio" })
@Injectable()
export class IsAllowedImageAspectRatioConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(DAM_CONFIG) private readonly config: DamConfig) {}

    validate(value: string): boolean {
        return this.config.allowedAspectRatios.includes(value);
    }

    defaultMessage(): string {
        return `Aspect ratio is not allowed`;
    }
}
