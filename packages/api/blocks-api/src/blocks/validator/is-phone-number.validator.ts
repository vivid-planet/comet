import { Injectable } from "@nestjs/common";
import { isString, registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

const PHONE_NUMBER_REGEX = /^\+?[0-9\s]+$/;

export const testPhoneNumber = (value: string): boolean => {
    return PHONE_NUMBER_REGEX.test(value);
};

export const IsPhoneNumber = () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            validator: IsPhoneNumberConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsPhoneNumber" })
@Injectable()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        if (!isString(value)) {
            return false;
        }
        return testPhoneNumber(value);
    }

    defaultMessage(): string {
        return "Invalid phone number";
    }
}
