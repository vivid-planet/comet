import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType()
export class SendTestEmailCampaignArgs {
    @Field(() => [String])
    @IsEmail({}, { each: true })
    emails: string[];
}
