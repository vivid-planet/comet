import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}
registerEnumType(UserStatus, {
    name: "UserStatus",
});

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    language: string;

    // TODO: Implementation for setting status
    @Field(() => UserStatus)
    status: UserStatus;
}
