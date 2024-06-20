import { Field, ID, InputType } from "@nestjs/graphql";
import { IsArray, IsUUID } from "class-validator";

@InputType()
export class SetProductCategoryInput {
    @Field(() => [ID], { defaultValue: [] })
    @IsArray()
    @IsUUID(undefined, { each: true })
    productIds: string[];
}
