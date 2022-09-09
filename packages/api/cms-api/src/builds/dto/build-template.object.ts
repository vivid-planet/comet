import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType("BuildTemplate")
export class BuildTemplateObject {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;
}
