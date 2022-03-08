import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ValidationArguments } from "class-validator/types/validation/ValidationArguments";

import { DamConfig } from "../../dam.config";
import { DAM_CONFIG } from "../../dam.constants";

export const IsValidImageAspectRatio = (widthProperty: string, validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsValidImageAspectRatioConstraint,
            constraints: [widthProperty],
        });
    };
};

@ValidatorConstraint({ name: "IsValidImageAspectRatio" })
@Injectable()
export class IsValidImageAspectRatioConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(DAM_CONFIG) private readonly config: DamConfig) {}

    validate(value: number, validationArguments: ValidationArguments): boolean {
        const widthProperty = validationArguments.constraints[0] as string;
        const width = (validationArguments.object as Record<string, unknown>)[widthProperty] as number;

        return this.config.allowedAspectRatios
            .split(",")
            .map((aspectRatioString) => {
                const values = aspectRatioString.split("x");
                const aspectRatio = Number(values[0]) / Number(values[1]);
                const height = Math.ceil(width / aspectRatio);
                return height;
            })
            .includes(value);
    }

    defaultMessage(): string {
        return `Aspect ratio is invalid`;
    }
}
