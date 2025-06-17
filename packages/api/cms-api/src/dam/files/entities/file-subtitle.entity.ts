import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { FileInterface } from "./file.entity";

@Entity({ tableName: "DamFileSubtitle" })
@ObjectType("DamFileSubtitle")
export class DamFileSubtitle extends BaseEntity<DamFileSubtitle, "id"> {
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @ManyToOne({ entity: "DamFile", onDelete: "cascade" })
    video!: FileInterface;

    @ManyToOne({ entity: "DamFile", onDelete: "cascade" })
    @Field(() => FileInterface)
    file!: FileInterface;

    @Property({ columnType: "text" })
    @Field()
    language!: string;
}
