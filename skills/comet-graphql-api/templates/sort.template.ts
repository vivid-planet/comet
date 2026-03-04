import { SortDirection } from "@comet/cms-api";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

// Add one enum value per sortable scalar field on the entity.
// For ManyToOne relations, also add joined fields: e.g. category_title, category_slug.
// Always include id, createdAt, updatedAt.
export enum {{EntityName}}SortField {
    id = "id",
    // {{SCALAR_FIELDS_HERE}} e.g. title = "title", status = "status"
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    // {{JOINED_RELATION_FIELDS_HERE}} e.g. category_title = "category_title"
}

registerEnumType({{EntityName}}SortField, {
    name: "{{EntityName}}SortField",
});

@InputType()
export class {{EntityName}}Sort {
    @Field(() => {{EntityName}}SortField)
    @IsEnum({{EntityName}}SortField)
    field: {{EntityName}}SortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}
