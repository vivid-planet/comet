import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsString } from "class-validator";

import { SortDirection } from "./sort-direction.enum";

@InputType()
export class SortInput {
    @Field()
    @IsString()
    columnName: string;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection;
}
