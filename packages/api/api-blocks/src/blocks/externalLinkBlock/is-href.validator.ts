import { Injectable } from "@nestjs/common";
import { isEmail, isString, isURL, registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

const PHONE_NUMBER_REGEX = /^\+?[0-9\s]+$/;

export const IsHref = () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            validator: IsHrefConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsHref" })
@Injectable()
export class IsHrefConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        if (!isString(value)) {
            return false;
        }

        if (value.startsWith("mailto:")) {
            return isEmail(value.slice(7));
        } else if (value.startsWith("tel:")) {
            return PHONE_NUMBER_REGEX.test(value.slice(4));
        } else {
            return isURL(value, { require_protocol: true, require_valid_protocol: false });
        }
    }

    defaultMessage(): string {
        return "Invalid href";
    }
}
