import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { GraphQLJSONObject } from "graphql-scalars";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";
import { ActionLogsArgs } from "./action-logs.args";

@ArgsType()
export class GlobalActionLogsArgs extends ActionLogsArgs {
    @Field(() => [GraphQLJSONObject])
    @IsArray()
    scopes: ContentScope[];
}
