import { Field, ObjectType } from "@nestjs/graphql";

import { User as UserInterface } from "../interfaces/user";

@ObjectType()
export class UserPermissionsUser implements UserInterface {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;
}
