import { Embeddable, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("DamFileLicense")
@Embeddable()
export class License {
    // TODO: maybe change to enum, depending on the available types
    @Property({ columnType: "text", default: "royalty_free" })
    @Field()
    type?: string = "royalty_free";

    @Property({
        columnType: "text",
        nullable: true,
    })
    @Field({ nullable: true })
    details?: string;

    @Property({
        columnType: "text",
        nullable: true,
    })
    @Field({ nullable: true })
    author?: string;

    @Property({
        columnType: "timestamp with time zone",
        nullable: true,
    })
    @Field({ nullable: true })
    durationFrom?: Date;

    @Property({
        columnType: "timestamp with time zone",
        nullable: true,
    })
    @Field({ nullable: true })
    durationTo?: Date;
}
