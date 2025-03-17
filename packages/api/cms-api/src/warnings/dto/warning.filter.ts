import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { DateTimeFilter } from "src/common/filter/date-time.filter";
import { createEnumFilter } from "src/common/filter/enum.filter.factory";
import { StringFilter } from "src/common/filter/string.filter";

import { WarningSeverity } from "../entities/warning-severity.enum";
import { WarningStatus } from "../entities/warning-status.enum";

@InputType()
class WarningSeverityEnumFilter extends createEnumFilter(WarningSeverity) {}
@InputType()
class WarningStatusEnumFilter extends createEnumFilter(WarningStatus) {}

@InputType()
export class WarningFilter {
    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => DateTimeFilter)
    createdAt?: DateTimeFilter;

    @Field(() => DateTimeFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => DateTimeFilter)
    updatedAt?: DateTimeFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    message?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => StringFilter)
    type?: StringFilter;

    @Field(() => WarningSeverityEnumFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => WarningSeverityEnumFilter)
    severity?: WarningSeverityEnumFilter;

    @Field(() => WarningStatusEnumFilter, { nullable: true })
    @ValidateNested()
    @IsOptional()
    @Type(() => WarningStatusEnumFilter)
    status?: WarningStatusEnumFilter;

    @Field(() => [WarningFilter], { nullable: true })
    @Type(() => WarningFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    and?: WarningFilter[];

    @Field(() => [WarningFilter], { nullable: true })
    @Type(() => WarningFilter)
    @ValidateNested({ each: true })
    @IsOptional()
    or?: WarningFilter[];
}
