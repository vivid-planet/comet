import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

@InputType()
export class UserPermissionInput {
    @Field()
    @IsString()
    permission: string;

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
