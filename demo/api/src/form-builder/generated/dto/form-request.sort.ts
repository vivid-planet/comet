// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { SortDirection } from "@comet/cms-api";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

export enum FormRequestSortField {
    id = "id",
    createdAt = "createdAt",
    form = "form",
}
registerEnumType(FormRequestSortField, {
    name: "FormRequestSortField",
});

@InputType()
export class FormRequestSort {
    @Field(() => FormRequestSortField)
    @IsEnum(FormRequestSortField)
    field: FormRequestSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}