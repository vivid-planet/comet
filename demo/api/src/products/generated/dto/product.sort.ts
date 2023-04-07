import { SortDirection } from "@comet/cms-api";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

export enum ProductSortField {
    title = "title",
    slug = "slug",
    description = "description",
    type = "type",
    price = "price",
    inStock = "inStock",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
}
registerEnumType(ProductSortField, {
    name: "ProductSortField",
});

@InputType()
export class ProductSort {
    @Field(() => ProductSortField)
    @IsEnum(ProductSortField)
    field: ProductSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
