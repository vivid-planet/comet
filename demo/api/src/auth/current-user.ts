import { CurrentUser as CometCurrentUser } from "@comet/cms-api";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CurrentUser extends CometCurrentUser {
    @Field()
    language: string;

    @Field(() => [String])
    domains: string[];
}
