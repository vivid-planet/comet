import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BrevoApiFolder {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;
}
