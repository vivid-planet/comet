import { Type } from "@nestjs/common";
import { plainToInstance, Transform } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { DamScopeInterface } from "../../types";

export interface UploadFileBodyInterface {
    folderId?: string;
    scope?: DamScopeInterface;
}

export function createUploadFileBody({ Scope }: { Scope?: Type<DamScopeInterface> }): Type<UploadFileBodyInterface> {
    class UploadFileBodyBase {
        @IsOptional()
        @IsString()
        folderId?: string;
    }

    if (Scope) {
        class UploadFileBody extends UploadFileBodyBase {
            @Transform(({ value }) => plainToInstance(Scope, JSON.parse(value)))
            @ValidateNested()
            scope: typeof Scope;
        }
        return UploadFileBody;
    } else {
        class UploadFileBody extends UploadFileBodyBase {}
        return UploadFileBody;
    }
}
