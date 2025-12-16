import { IsUndefinable } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsString } from "class-validator";

@InputType()
export class ContactFormArgs {
    @Field(() => String)
    @IsString()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsUndefinable()
    company?: string;

    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsUndefinable()
    phone?: string;

    @Field(() => String)
    @IsString()
    subject: string;

    @Field(() => String)
    @IsString()
    message: string;

    @Field(() => Boolean)
    @IsBoolean()
    privacyConsent: boolean;
}
