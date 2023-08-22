import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

import { IsUndefinable } from "../../common/validators/is-undefinable";

@InputType()
export class DependenciesFilterInput {
    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    targetGraphqlObjectType?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    targetId?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootColumnName?: string;
}

@InputType()
export class DependentsFilterInput {
    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootGraphqlObjectType?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootId?: string;

    @Field({ nullable: true })
    @IsString()
    @IsUndefinable()
    rootColumnName?: string;
}
