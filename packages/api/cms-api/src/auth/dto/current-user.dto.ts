import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CurrentUser {
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    role?: string;
}
