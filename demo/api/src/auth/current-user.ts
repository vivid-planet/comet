import { CurrentUser as CometCurrentUser } from "@comet/cms-api";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CurrentUser extends CometCurrentUser {
    @Field(() => [String])
    domains: string[];
}
