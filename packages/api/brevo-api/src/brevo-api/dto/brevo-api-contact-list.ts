import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BrevoApiContactList {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    createdAt?: string;

    @Field(() => String)
    name: string;

    @Field(() => Int)
    totalBlacklisted: number;

    @Field(() => Int)
    totalSubscribers: number;

    @Field(() => Int)
    uniqueSubscribers: number;

    @Field(() => Int)
    folderId: number;

    @Field(() => Boolean, { nullable: true })
    dynamicList?: boolean;
}
