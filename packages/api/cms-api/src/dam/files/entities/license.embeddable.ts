import { Embeddable, Enum, Property } from "@mikro-orm/core";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum LicenseType {
    ROYALTY_FREE = "royalty_free",
    RIGHTS_MANAGED = "rights_managed",
    SUBSCRIPTION = "subscription",
    MICRO = "micro",
}
registerEnumType(LicenseType, { name: "LicenseType" });

@ObjectType("DamFileLicense")
@Embeddable()
export class License {
    @Enum({ items: () => LicenseType, default: LicenseType.ROYALTY_FREE })
    @Field(() => LicenseType)
    type?: LicenseType = LicenseType.ROYALTY_FREE;

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
