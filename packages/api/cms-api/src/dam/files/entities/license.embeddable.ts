import { Embeddable, Enum, Property } from "@mikro-orm/core";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export enum LicenseType {
    ROYALTY_FREE = "ROYALTY_FREE",
    RIGHTS_MANAGED = "RIGHTS_MANAGED",
    SUBSCRIPTION = "SUBSCRIPTION",
    MICRO = "MICRO",
}
registerEnumType(LicenseType, { name: "LicenseType" });

@ObjectType("DamFileLicense")
@Embeddable()
export class License {
    @Enum({ items: () => LicenseType, nullable: true })
    @Field(() => LicenseType, { nullable: true })
    @IsOptional()
    @IsEnum(LicenseType)
    type?: LicenseType;

    @Property({
        columnType: "text",
        nullable: true,
    })
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    details?: string;

    @Property({
        columnType: "text",
        nullable: true,
    })
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    author?: string;

    @Property({
        columnType: "timestamp with time zone",
        nullable: true,
    })
    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    durationFrom?: Date;

    @Property({
        columnType: "timestamp with time zone",
        nullable: true,
    })
    @Field({ nullable: true })
    @IsDate()
    durationTo?: Date;
}
