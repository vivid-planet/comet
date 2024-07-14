import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { UpdateFileInput } from "../files/dto/file.input";
import { UpdateDamFileArgs } from "../files/dto/update-dam-file.args";
import { FILE_ENTITY, FileInterface } from "../files/entities/file.entity";
import { FileValidationService } from "../files/file-validation.service";

export const HasValidFilename = () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            validator: HasValidFilenameConstraint,
        });
    };
};

export interface HasValidFilenameValidationArguments extends ValidationArguments {
    object: UpdateDamFileArgs;
}

@ValidatorConstraint({ name: "HasValidFilename", async: true })
@Injectable()
export class HasValidFilenameConstraint implements ValidatorConstraintInterface {
    errorMessage: string | undefined;

    constructor(
        private readonly fileValidationService: FileValidationService,
        @InjectRepository(FILE_ENTITY) private readonly filesRepository: EntityRepository<FileInterface>,
    ) {}

    async validate(value: UpdateFileInput, validationArguments: HasValidFilenameValidationArguments): Promise<boolean> {
        if (value.name === undefined) {
            return true;
        }

        const id = validationArguments.object.id;
        const file = await this.filesRepository.findOneOrFail({ id });

        const filenameValidationError = this.fileValidationService.validateFilename(value.name, file.mimetype);
        this.errorMessage = filenameValidationError;

        return filenameValidationError === undefined;
    }

    defaultMessage(): string {
        return this.errorMessage ?? "Invalid filename";
    }
}
