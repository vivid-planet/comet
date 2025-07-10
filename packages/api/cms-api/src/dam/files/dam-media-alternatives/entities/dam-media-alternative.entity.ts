import { BaseEntity, Entity, Enum, ManyToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { ScopedEntity } from "../../../../user-permissions/decorators/scoped-entity.decorator";
import { FILE_ENTITY, FileInterface } from "../../entities/file.entity";

export enum DamMediaAlternativeType {
    captions = "captions",
    audioDescriptions = "audioDescriptions",
    transcripts = "transcripts",
}
registerEnumType(DamMediaAlternativeType, { name: "DamMediaAlternativeType" });

@Entity()
@ObjectType()
@ScopedEntity(async (damMediaAlternative: DamMediaAlternative) => {
    const scope = (await damMediaAlternative.for.load()).scope;
    return scope;
})
export class DamMediaAlternative extends BaseEntity<DamMediaAlternative, "id"> {
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property({ columnType: "text" })
    @Field()
    language: string;

    @Enum({ items: () => DamMediaAlternativeType })
    @Field(() => DamMediaAlternativeType)
    type: DamMediaAlternativeType;

    @ManyToOne({
        entity: () => FILE_ENTITY,
        inversedBy: (file: FileInterface) => file.alternativesForThisFile,
        onDelete: "cascade",
        ref: true,
    })
    for: Ref<FileInterface>;

    @ManyToOne({
        entity: () => FILE_ENTITY,
        inversedBy: (file: FileInterface) => file.thisFileIsAlternativeFor,
        onDelete: "cascade",
        ref: true,
    })
    alternative: Ref<FileInterface>;
}
