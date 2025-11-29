import { Field, ID, ObjectType } from "@nestjs/graphql";

import { LABEL_ANNOTATION } from "../../kubernetes/kubernetes.constants";

@ObjectType("KubernetesCronJob")
export class CronJob {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true, description: `Human readable label provided by ${LABEL_ANNOTATION} annotation. Use name as fallback if not present` })
    label?: string;

    @Field()
    schedule: string;

    @Field()
    suspend: boolean;

    @Field({ nullable: true })
    lastScheduledAt?: Date;
}
