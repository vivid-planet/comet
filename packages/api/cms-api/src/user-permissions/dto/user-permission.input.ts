import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsDate, IsObject, IsOptional, IsString, IsUUID } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { PermissionConfiguration } from "../access-control.service";
import { ContentScope } from "../interfaces/content-scope.interface";

@InputType()
export class UserPermissionContentScopesInput {
    @Field(() => ID)
    @IsUUID()
    permissionId: string;

    @Field(() => Boolean)
    @IsBoolean()
    overrideContentScopes: boolean;

    @Field(() => [GraphQLJSONObject], { defaultValue: [] })
    @IsArray()
    contentScopes: ContentScope[] = [];
}

@InputType()
export class UserPermissionInput {
    @Field()
    @IsString()
    permission: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsObject()
    @IsOptional()
    configuration?: PermissionConfiguration;

    @Field(() => Date, { nullable: true })
    @IsDate()
    @IsOptional()
    validFrom?: Date;

    @Field(() => Date, { nullable: true })
    @IsDate()
    @IsOptional()
    validTo?: Date;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    reason?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    requestedBy?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    approvedBy?: string;
}

@InputType()
export class CreateUserPermissionInput extends UserPermissionInput {
    @Field()
    @IsString()
    userId: string;
}

@InputType()
export class UpdateUserPermissionInput extends PartialType(UserPermissionInput) {
    @Field(() => ID)
    @IsUUID()
    id: string;
}
