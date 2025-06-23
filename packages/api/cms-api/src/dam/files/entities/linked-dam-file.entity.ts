import { BaseEntity, Entity, Enum, ManyToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { FILE_ENTITY, FileInterface } from "./file.entity";

export interface LinkedDamFileInterface {
    id: string;
    language: string;
    type: LinkedDamFileType;
    source: Ref<FileInterface>;
    target: Ref<FileInterface>;
}

export enum LinkedDamFileType {
    captions = "captions",
}
registerEnumType(LinkedDamFileType, { name: "LinkedDamFileType" });

@Entity()
@ObjectType()
export class LinkedDamFile extends BaseEntity<LinkedDamFile, "id"> implements LinkedDamFileInterface {
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property({ columnType: "text" })
    @Field()
    language: string;

    @Enum({ items: () => LinkedDamFileType })
    @Field(() => LinkedDamFileType)
    type: LinkedDamFileType;

    @ManyToOne({
        entity: () => FILE_ENTITY,
        inversedBy: (file: FileInterface) => file.linkedDamFileSources,
        onDelete: "cascade",
        ref: true,
    })
    source: Ref<FileInterface>;

    @ManyToOne({
        entity: () => FILE_ENTITY,
        inversedBy: (file: FileInterface) => file.linkedDamFileTargets,
        onDelete: "cascade",
        ref: true,
    })
    target: Ref<FileInterface>;
}
