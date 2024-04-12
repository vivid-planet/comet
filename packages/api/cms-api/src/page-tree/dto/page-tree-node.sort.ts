import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

import { SortDirection } from "../../common/sorting/sort-direction.enum";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
export enum PageTreeNodeSortField {
    updatedAt = "updatedAt",
    pos = "pos",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(PageTreeNodeSortField, {
    name: "PageTreeNodeSortField",
});

@InputType()
export class PageTreeNodeSort {
    @Field(() => PageTreeNodeSortField)
    @IsEnum(PageTreeNodeSortField)
    field: PageTreeNodeSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
