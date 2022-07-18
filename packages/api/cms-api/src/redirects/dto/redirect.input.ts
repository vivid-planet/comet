import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsOptional, IsUrl, ValidateIf, ValidationArguments } from "class-validator";

import { PageExists } from "../../page-tree/validators/page-exists.validator";
import { RedirectGenerationType, RedirectSourceTypeValues, RedirectTargetTypeValues } from "../redirects.enum";
import { IsValidRedirectSource } from "../validators/isValidRedirectSource";
import { RedirectTargetTypeMatch } from "../validators/redirectTargetTypeMatch";

export interface RedirectValidationArguments extends ValidationArguments {
    object: CreateRedirectInput;
}

@InputType()
export class CreateRedirectInput {
    @IsEnum(RedirectSourceTypeValues)
    @Field(() => RedirectSourceTypeValues)
    sourceType: RedirectSourceTypeValues;

    @IsValidRedirectSource()
    @Field()
    source: string;

    @IsEnum(RedirectTargetTypeValues)
    @RedirectTargetTypeMatch()
    @Field(() => RedirectTargetTypeValues)
    targetType: RedirectTargetTypeValues;

    @ValidateIf((o: CreateRedirectInput) => o.targetType === RedirectTargetTypeValues.extern)
    @IsUrl(
        {
            protocols: ["http", "https"],
            require_protocol: true,
        },
        {
            message: "Url needs to start with http:// or https://",
        },
    )
    @Field({ nullable: true })
    targetUrl?: string;

    @ValidateIf((o: CreateRedirectInput) => o.targetType === RedirectTargetTypeValues.intern)
    @PageExists()
    @Field({ nullable: true })
    targetPageId?: string;

    @IsOptional()
    @Field({ nullable: true })
    comment?: string;

    @IsOptional()
    @Field({ nullable: true })
    active?: boolean;

    @IsEnum(RedirectGenerationType)
    @Field(() => RedirectGenerationType)
    generationType: RedirectGenerationType;
}

@InputType()
export class UpdateRedirectInput extends PartialType(CreateRedirectInput) {}

@InputType()
export class RedirectUpdateActivenessInput {
    @IsBoolean()
    @Field()
    active: boolean;
}
