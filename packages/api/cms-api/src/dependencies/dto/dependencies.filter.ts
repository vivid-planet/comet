import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsString } from "class-validator";

import { IsUndefinable } from "../../common/validators/is-undefinable";

@InputType()
export class DependencyFilter {
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

    @Field(() => Boolean, { defaultValue: true })
    @IsBoolean()
    visible: boolean;
}

@InputType()
export class DependentFilter {
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

    @Field(() => Boolean, { defaultValue: true })
    @IsBoolean()
    visible: boolean;
}
