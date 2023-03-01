import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { SortDirection } from "./sort-direction.enum";

@ArgsType()
export class SortArgs {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    sortColumnName?: string;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    sortDirection?: SortDirection = SortDirection.ASC;
}

@InputType()
export class SortInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    sortColumnName?: string;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    sortDirection?: SortDirection = SortDirection.ASC;
}
