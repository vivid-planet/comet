import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export const IsSlug = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsSlugConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsSlug", async: true })
export class IsSlugConstraint implements ValidatorConstraintInterface {
    async validate(value: string): Promise<boolean> {
        // Regex matches unreserved characters and percent encoding (see https://tools.ietf.org/html/rfc3986#section-2.1)
        return /^([a-zA-Z0-9-._~]|%[0-9a-fA-F]{2})+$/.test(value);
    }

    defaultMessage(): string {
        return "slug contains forbidden symbols";
    }
}
