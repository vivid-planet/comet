import { Field, ID, ObjectType } from "@nestjs/graphql";

import { JobStatus } from "../../kubernetes/job-status.enum";

@ObjectType()
export class Build {
    @Field(() => ID)
    id: string;

    @Field(() => JobStatus)
    status: JobStatus;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    trigger?: string;

    @Field({ nullable: true })
    startTime?: Date;

    @Field({ nullable: true })
    completionTime?: Date;

    @Field({ nullable: true })
    estimatedCompletionTime?: Date;
}
