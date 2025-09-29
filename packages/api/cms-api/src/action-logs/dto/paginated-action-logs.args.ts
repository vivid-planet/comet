import { ArgsType, Field } from "@nestjs/graphql";
import { Type as TransformerType } from "class-transformer";
import { ValidateNested } from "class-validator";

import { OffsetBasedPaginationArgs } from "../../common/pagination/offset-based.args";
import { ActionLogSort } from "./action-log.sort";

@ArgsType()
export class PaginatedActionLogsArgs extends OffsetBasedPaginationArgs {
    @Field(() => [ActionLogSort], { nullable: true })
    @ValidateNested({ each: true })
    @TransformerType(() => ActionLogSort)
    sort?: ActionLogSort[];
}
