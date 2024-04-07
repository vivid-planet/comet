import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

import { SortDirection } from "../../common/sorting/sort-direction.enum";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
export enum RedirectSortField {
    source = "source",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(RedirectSortField, {
    name: "RedirectSortField",
});

@InputType()
export class RedirectSort {
    @Field(() => RedirectSortField)
    @IsEnum(RedirectSortField)
    field: RedirectSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
