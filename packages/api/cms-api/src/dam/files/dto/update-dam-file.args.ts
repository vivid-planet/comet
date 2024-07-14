import { ArgsType, Field, ID } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

import { HasValidFilename } from "../../common/has-valid-filename.decorator";
import { UpdateFileInput } from "./file.input";

@ArgsType()
export class UpdateDamFileArgs {
    @Field(() => ID)
    @IsString()
    id: string;

    @Field(() => UpdateFileInput)
    @Type(() => UpdateFileInput)
    @ValidateNested()
    @HasValidFilename()
    input: UpdateFileInput;
}
