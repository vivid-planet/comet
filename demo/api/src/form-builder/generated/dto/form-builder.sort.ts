// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { SortDirection } from "@comet/cms-api";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

export enum FormBuilderSortField {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    name = "name",
    submitButtonText = "submitButtonText",
}
registerEnumType(FormBuilderSortField, {
    name: "FormBuilderSortField",
});

@InputType()
export class FormBuilderSort {
    @Field(() => FormBuilderSortField)
    @IsEnum(FormBuilderSortField)
    field: FormBuilderSortField;

    @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
    @IsEnum(SortDirection)
    direction: SortDirection = SortDirection.ASC;
}