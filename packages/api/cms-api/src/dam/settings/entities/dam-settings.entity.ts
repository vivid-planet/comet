import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";

import { FILE_ENTITY, FileInterface } from "../../files/entities/file.entity";
import { DamScopeInterface } from "../../types";

@Entity()
@ObjectType()
export class DamSettings extends BaseEntity {
    // Derived from the scope (see createDamSettingsId) so that each DAM scope has exactly one settings entry
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string;

    @Property({ type: "jsonb", nullable: true })
    scope?: DamScopeInterface;

    @ManyToOne({
        entity: () => FILE_ENTITY,
        joinColumn: "invalidLicenseFallbackImageId",
        nullable: true,
        deleteRule: "set null",
        ref: true,
    })
    invalidLicenseFallbackImage?: Ref<FileInterface>;
}
