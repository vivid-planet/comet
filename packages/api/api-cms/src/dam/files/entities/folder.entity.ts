import { ArrayType, BaseEntity, Entity, Index, ManyToOne, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

import { File } from "./file.entity";

@ObjectType("DamFolder")
@Entity({ tableName: "DamFolder" })
export class Folder extends BaseEntity<Folder, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "archived" | "children" | "numberOfFiles" | "files" | "numberOfChildFolders";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property({ columnType: "text" })
    @Field()
    name: string;

    @ManyToOne({
        entity: () => Folder,
        inversedBy: (folder) => folder.children,
        joinColumn: "parentId",
        nullable: true,
        onDelete: "CASCADE",
    })
    @Field(() => Folder, { nullable: true })
    parent: Folder | null;

    @OneToMany(() => Folder, (folder) => folder.parent)
    children: Folder[];

    @Property({ persist: false })
    @Field(() => Int)
    numberOfChildFolders: number;

    @Property({ persist: false })
    @Field(() => Int)
    numberOfFiles: number;

    @Property({ columnType: "uuid array", type: ArrayType })
    @Index()
    @Field(() => [ID])
    mpath: string[];

    @Property({ columnType: "boolean", default: false })
    @Field()
    archived: boolean;

    @OneToMany(() => File, (file) => file.folder)
    files: File[];

    @Property({ columnType: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({
        columnType: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
