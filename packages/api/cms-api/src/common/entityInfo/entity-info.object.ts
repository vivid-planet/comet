import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("EntityInfo")
export class EntityInfoObject {
    @Field()
    name: string;

    @Field({ nullable: true })
    secondaryInformation?: string;
}
