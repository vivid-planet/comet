import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json";

@ObjectType()
export class CurrentUser implements CurrentUserInterface {
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    language: string;

    @Field()
    role: string;

    @Field(() => JSON)
    rights: Rights;
}

interface Rights {
    [key: string]: Array<string>;
}

export interface CurrentUserInterface {
    id: string;
    name: string;
    language: string;
    role: string;
    rights: Rights;
}
