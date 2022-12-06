import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CronJob {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    schedule: string;

    @Field({ nullable: true })
    lastScheduledAt?: Date;
}
