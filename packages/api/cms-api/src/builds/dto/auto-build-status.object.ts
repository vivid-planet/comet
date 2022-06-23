import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("AutoBuildStatus")
export class AutoBuildStatus {
    @Field()
    hasChangesSinceLastBuild: boolean;

    @Field({ nullable: true })
    lastCheck?: Date;

    @Field()
    nextCheck: Date;
}
