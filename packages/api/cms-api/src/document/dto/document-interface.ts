import { Field, ID, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export abstract class DocumentInterface {
    @Field(() => ID)
    id: string;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    lastUpdatedUserLabel?: string;
}
