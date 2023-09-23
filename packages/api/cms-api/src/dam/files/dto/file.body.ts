import { Type } from "@nestjs/common";
import { plainToInstance, Transform, Type as ClassTransformerType } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { ImageCropAreaInput } from "../../images/dto/image-crop-area.input";
import { DamScopeInterface } from "../../types";
import { LicenseInput } from "./file.input";

export interface UploadFileBodyInterface {
    scope: DamScopeInterface;
    folderId?: string;
    title?: string;
    altText?: string;
    license?: LicenseInput;
    imageCropArea?: ImageCropAreaInput;
    copyOfId?: string;
}

export function createUploadFileBody({ Scope }: { Scope: Type<DamScopeInterface> }): Type<UploadFileBodyInterface> {
    class UploadFileBody implements UploadFileBodyInterface {
        @Transform(({ value }) => plainToInstance(Scope, JSON.parse(value)))
        @ValidateNested()
        scope: DamScopeInterface;

        @IsOptional()
        @IsString()
        folderId?: string;

        @IsOptional()
        @IsString()
        title?: string;

        @IsOptional()
        @IsString()
        altText?: string;

        @Transform(({ value }) => plainToInstance(LicenseInput, JSON.parse(value)))
        @IsOptional()
        @ClassTransformerType(() => LicenseInput)
        @ValidateNested()
        license?: LicenseInput;

        @Transform(({ value }) => plainToInstance(ImageCropAreaInput, JSON.parse(value)))
        @IsOptional()
        @ClassTransformerType(() => ImageCropAreaInput)
        @ValidateNested()
        imageCropArea?: ImageCropAreaInput;

        @IsOptional()
        @IsString()
        copyOfId?: string;
    }

    return UploadFileBody;
}
