import { Field, ID, InputType } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsHash,
    IsInt,
    IsMimeType,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
    ValidateIf,
    ValidateNested,
} from "class-validator";

import { IsNullable } from "../../../common/validators/is-nullable";
import { IsUndefinable } from "../../../common/validators/is-undefinable";
import { ImageCropAreaInput } from "../../images/dto/image-crop-area.input";
import { DamScopeInterface } from "../../types";
import { LicenseType } from "../entities/license.embeddable";
import { LinkedDamFileType } from "../entities/linked-dam-file.entity";

export class ImageFileInput {
    @IsOptional()
    @IsInt()
    width?: number;

    @IsOptional()
    @IsInt()
    height?: number;

    @IsOptional()
    @IsObject()
    exif?: Record<string, number | string | Array<number> | Uint8Array | Uint16Array>;

    @Type(() => ImageCropAreaInput)
    @IsOptional()
    @ValidateNested()
    cropArea?: ImageCropAreaInput;
}

@InputType()
export class LicenseInput {
    @Field(() => LicenseType, { nullable: true })
    @IsOptional()
    @IsEnum(LicenseType)
    type?: LicenseType;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    details?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    author?: string;

    @Field(() => Date, { nullable: true })
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsOptional()
    @IsDate()
    durationFrom?: Date;

    @Field(() => Date, { nullable: true })
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsOptional()
    @IsDate()
    durationTo?: Date;
}

export class CreateFileInput {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    size: number;

    @IsNotEmpty()
    @IsMimeType()
    mimetype: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ImageFileInput)
    image?: ImageFileInput;

    @IsNotEmpty()
    @IsHash("md5")
    contentHash: string;

    @IsOptional()
    @IsUUID()
    folderId?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => LicenseInput)
    license?: LicenseInput;

    // TODO is this validation even used?
    @IsObject()
    scope?: DamScopeInterface;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((input) => input.importSourceType !== undefined)
    importSourceId?: string;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((input) => input.importSourceId !== undefined)
    importSourceType?: string;
}

@InputType({ isAbstract: true })
export class UpdateImageFileInput {
    @Field(() => ImageCropAreaInput, {
        nullable: true,
    })
    @Type(() => ImageCropAreaInput)
    @IsOptional()
    @ValidateNested()
    cropArea?: ImageCropAreaInput;
}

@InputType("UpdateDamFileInput")
export class UpdateFileInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    title?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    altText?: string;

    @Field(() => UpdateImageFileInput, { nullable: true })
    @Type(() => UpdateImageFileInput)
    @IsOptional()
    @ValidateNested()
    image?: UpdateImageFileInput;

    @Field(() => ID, { nullable: true })
    @IsUUID()
    @IsNullable()
    @IsUndefinable()
    folderId: string | null | undefined;

    @Field({ nullable: true })
    @Type(() => LicenseInput)
    @IsOptional()
    @ValidateNested()
    license?: LicenseInput;

    @Field(() => [LinkedDamFileTargetInput], { nullable: true })
    @Type(() => LinkedDamFileTargetInput)
    @ValidateNested({ each: true })
    @IsOptional()
    linkedDamFileTargets?: Array<LinkedDamFileTargetInput>;

    @Field(() => [LinkedDamFileSourceInput], { nullable: true })
    @Type(() => LinkedDamFileSourceInput)
    @ValidateNested({ each: true })
    @IsOptional()
    linkedDamFileSources?: Array<LinkedDamFileSourceInput>;
}

@InputType({ isAbstract: true })
class LinkedDamFileInput {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    id?: string;

    @Field()
    @IsString()
    @MinLength(2)
    language: string;

    @Field(() => LinkedDamFileType)
    @IsEnum(LinkedDamFileType)
    type: LinkedDamFileType;
}

@InputType({ isAbstract: true })
export class LinkedDamFileTargetInput extends LinkedDamFileInput {
    @Field(() => ID)
    @IsUUID()
    targetFileId: string;
}

@InputType({ isAbstract: true })
export class LinkedDamFileSourceInput extends LinkedDamFileInput {
    @Field(() => ID)
    @IsUUID()
    sourceFileId: string;
}
