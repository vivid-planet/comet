import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

@InputType()
export class UserContentScopesInput {
    @Field()
    @IsString()
    userId: string;

    @Field(() => [UserContentScopeInput])
    @ValidateNested({ each: true })
    @Type(() => UserContentScopeInput)
    scopes: UserContentScopeInput[];
}

@InputType()
class UserContentScopeInput {
    @Field()
    @IsString()
    scope: string;

    @Field(() => [String])
    @IsArray()
    values: string[];
}
