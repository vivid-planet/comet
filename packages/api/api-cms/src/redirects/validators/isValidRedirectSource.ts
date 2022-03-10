import { isURL, registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { RedirectValidationArguments } from "../dto/redirect.input";
import { RedirectSourceTypeValues } from "../redirects.enum";

export const IsValidRedirectSource = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsValidRedirectSourceConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsValidRedirectSource", async: true })
export class IsValidRedirectSourceConstraint implements ValidatorConstraintInterface {
    async validate(value: string, validationArguments: RedirectValidationArguments): Promise<boolean> {
        const sourceType = validationArguments.object.sourceType;

        if (sourceType === RedirectSourceTypeValues.path) {
            return value.startsWith("/");
        } else {
            return isURL(value);
        }
    }
}
