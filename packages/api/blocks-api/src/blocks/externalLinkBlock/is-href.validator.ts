import { Injectable } from "@nestjs/common";
import { isEmail, isString, isURL, registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

const PHONE_NUMBER_REGEX = /^\+?[0-9\s]+$/;

export const IsLinkTarget = () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            validator: IsLinkTargetConstraint,
        });
    };
};

/**
 * @deprecated The decorator `IsHref` will be removed in a future version. Please use `IsLinkTarget` instead.
 */
export const IsHref = IsLinkTarget;

@ValidatorConstraint({ name: "IsLinkTarget" })
@Injectable()
export class IsLinkTargetConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        if (!isString(value)) {
            return false;
        }

        if (value.toLowerCase().includes("javascript:")) {
            return false;
        } else if (value.toLowerCase().includes("data:")) {
            return false;
        } else if (value.startsWith("mailto:")) {
            return isEmail(value.slice(7));
        } else if (value.startsWith("tel:")) {
            return PHONE_NUMBER_REGEX.test(value.slice(4));
        } else {
            return isURL(value, { require_protocol: true, require_valid_protocol: false });
        }
    }

    defaultMessage(): string {
        return "Invalid link target";
    }
}

/**
 * @deprecated The class `IsHrefConstraint` will be removed in a future version. Please use `IsLinkTargetConstraint` instead.
 */
export class IsHrefConstraint extends IsLinkTargetConstraint {
    constructor() {
        super();
    }
}
