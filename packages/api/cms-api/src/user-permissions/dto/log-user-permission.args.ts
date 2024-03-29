import { ArgsType, Field } from "@nestjs/graphql";
import { IsString } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";

@ArgsType()
export class LogUserPermissionArgs extends OffsetBasedPaginationArgs {
    @Field()
    @IsString()
    userId: string;
}
