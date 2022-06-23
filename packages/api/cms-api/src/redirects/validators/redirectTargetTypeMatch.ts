import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { RedirectValidationArguments } from "../dto/redirect.input";
import { RedirectTargetTypeValues } from "../redirects.enum";

// Solution similar to https://github.com/typestack/class-validator/issues/486#issuecomment-606767275
export const RedirectTargetTypeMatch = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: RedirectTargetTypeMatchConstraint,
        });
    };
};

@ValidatorConstraint({ name: "RedirectTargetTypeMatch" })
export class RedirectTargetTypeMatchConstraint implements ValidatorConstraintInterface {
    validate(value: RedirectTargetTypeValues, validationArguments: RedirectValidationArguments): boolean {
        const targetUrl = validationArguments.object.targetUrl;
        const targetPageId = validationArguments.object.targetPageId;

        if (value === RedirectTargetTypeValues.intern) {
            return !!targetPageId;
        } else if (value === RedirectTargetTypeValues.extern) {
            return !!targetUrl;
        }

        return false;
    }

    defaultMessage(): string {
        return `targetType does not match targetUrl or targetPageId`;
    }
}
