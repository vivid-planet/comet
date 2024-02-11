import { Field, ObjectType } from "@nestjs/graphql";
import { CurrentUserInterface } from "src/auth/current-user/current-user";

@ObjectType()
export class User implements CurrentUserInterface {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    language: string;
}
