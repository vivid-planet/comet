import { CurrentUser as CometCurrentUser } from "@comet/cms-api";
import { Field, ObjectType } from "@nestjs/graphql";

declare module "@comet/cms-api" {
    interface CurrentUserInterface {
        domains: Array<"main" | "secondary">;
    }
}

@ObjectType()
export class CurrentUser extends CometCurrentUser {
    @Field(() => [String])
    domains: Array<"main" | "secondary">;
}
