import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BrevoApiCampaignStatistics {
    @Field(() => Int, { description: "Number of unique clicks for the campaign" })
    uniqueClicks: number;

    @Field(() => Int, { description: "Number of total clicks for the campaign" })
    clickers: number;

    @Field(() => Int, { description: "Number of complaints (Spam reports) for the campaign" })
    complaints: number;

    @Field(() => Int, { description: "Number of delivered emails for the campaign" })
    delivered: number;

    @Field(() => Int, { description: "Number of sent emails for the campaign" })
    sent: number;

    @Field(() => Int, { description: "Number of softbounce for the campaign" })
    softBounces: number;

    @Field(() => Int, { description: "Number of hardbounces for the campaign" })
    hardBounces: number;

    @Field(() => Int, { description: "Number of unique openings for the campaign" })
    uniqueViews: number;

    @Field(() => Int, { description: "Number of unique openings for the campaign" })
    trackableViews: number;

    @Field(() => Int, {
        description: "Rate of recipients without any privacy protection option enabled in their email client, applied to all delivered emails",
    })
    estimatedViews?: number;

    @Field(() => Int, { description: "Number of unsubscription for the campaign" })
    unsubscriptions: number;

    @Field(() => Int, { description: "Number of openings for the campaign" })
    viewed: number;
}
