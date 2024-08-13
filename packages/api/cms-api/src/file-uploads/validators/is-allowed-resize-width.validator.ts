import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ValidationArguments } from "class-validator/types/validation/ValidationArguments";

import { FileUploadsConfig } from "../file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "../file-uploads.constants";

export const IsAllowedResizeWidth = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsAllowedResizeWidthConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsAllowedResizeWidth" })
@Injectable()
export class IsAllowedResizeWidthConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig) {}

    validate(value: number): boolean {
        if (!this.config.download?.allowedImageSizes) {
            throw new Error("File Uploads: Missing download configuration");
        }

        return this.config.download.allowedImageSizes.includes(value);
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        return `${validationArguments.property} is not allowed`;
    }
}
