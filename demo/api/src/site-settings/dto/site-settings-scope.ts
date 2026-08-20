import { Embeddable, Property } from "@mikro-orm/postgresql";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@ObjectType()
@InputType("SiteSettingsScopeInput")
export class SiteSettingsScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;

    @Property({ columnType: "text" })
    @Field()
    @IsString()
    language: string;
}
