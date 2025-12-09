import { Type } from "class-transformer";
import { IsInt } from "class-validator";

import { IsUndefinable } from "../../common/validators/is-undefinable";

export class FileUploadBody {
    @IsInt()
    @IsUndefinable()
    @Type(() => Number)
    expiresIn?: number;
}
