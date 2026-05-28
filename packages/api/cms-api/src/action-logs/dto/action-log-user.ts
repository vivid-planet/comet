import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ActionLogUser {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;
}
