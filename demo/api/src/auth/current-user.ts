import { CurrentUserInterface } from "@comet/cms-api";
import { Field, ObjectType } from "@nestjs/graphql";

declare module "@comet/cms-api" {
    interface CurrentUserInterface {
        domains: string[];
    }
}

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

    @Field(() => [String])
    domains: string[];
}
