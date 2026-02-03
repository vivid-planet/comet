import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MutationError {
    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    field?: string;

    @Field()
    code: string;
}
