import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export const IsFutureDate = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsFutureDateConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsFutureDate" })
@Injectable()
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
    validate(date: Date | null | undefined): boolean {
        if (!date) {
            return true; // Allow null/undefined, other validators can handle required validation
        }

        const now = new Date();
        return date > now;
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} must be in the future`;
    }
}
