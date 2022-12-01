import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType("CronJob")
export class CronJobObject {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    schedule: string;

    @Field({ nullable: true })
    lastScheduledAt?: Date;
}
