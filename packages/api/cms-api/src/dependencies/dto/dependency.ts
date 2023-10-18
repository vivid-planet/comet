import { Field, ObjectType } from "@nestjs/graphql";

import { DependencyEntity } from "../entities/dependency.entity";

@ObjectType()
export class Dependency extends DependencyEntity {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    secondaryInformation?: string;
}
