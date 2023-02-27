import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { PageTreeNodeCategory } from "../types";

@InputType()
export class PageTreeNodeFilter {
    @Field({ nullable: true })
    @IsOptional()
    category?: PageTreeNodeCategory;

    @Field(() => [PageTreeNodeFilter], { nullable: true })
    @Type(() => PageTreeNodeFilter)
    @ValidateNested({ each: true })
    and?: PageTreeNodeFilter[];

    @Field(() => [PageTreeNodeFilter], { nullable: true })
    @Type(() => PageTreeNodeFilter)
    @ValidateNested({ each: true })
    or?: PageTreeNodeFilter[];
}
