import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CurrentUser implements CurrentUserInterface {
    id: string;

    @Field()
    name: string;

    @Field()
    role: string;
}

export interface CurrentUserInterface {
    id: string;
    name: string;
    role: string;
}
