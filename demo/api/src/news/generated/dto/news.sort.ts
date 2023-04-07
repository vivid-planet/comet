import { SortDirection } from "@comet/cms-api";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

export enum NewsSortField {
    slug = "slug",
    title = "title",
    date = "date",
    category = "category",
    visible = "visible",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
}
registerEnumType(NewsSortField, {
    name: "NewsSortField",
});

@InputType()
export class NewsSort {
    @Field(() => NewsSortField)
    @IsEnum(NewsSortField)
    field: NewsSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
