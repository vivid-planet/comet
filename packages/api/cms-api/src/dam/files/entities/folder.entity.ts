import { ArrayType, BaseEntity, Cascade, Embedded, Entity, Index, ManyToOne, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { DamScopeInterface } from "../../types";
import { FileInterface } from "./file.entity";

export interface FolderInterface extends BaseEntity<FolderInterface, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "archived" | "children" | "numberOfFiles" | "files" | "numberOfChildFolders";
    id: string;
    name: string;
    parent: FolderInterface | null;
    children: FolderInterface[];
    numberOfChildFolders: number;
    numberOfFiles: number;
    mpath: string[];
    archived: boolean;
    isInboxFromOtherScope: boolean;
    files: FileInterface[];
    createdAt: Date;
    updatedAt: Date;
    scope?: DamScopeInterface;
}

export function createFolderEntity({ Scope }: { Scope?: Type<DamScopeInterface> } = {}): Type<FolderInterface> {
    @Entity({ abstract: true })
    @ObjectType({ isAbstract: true })
    class FolderBase extends BaseEntity<FolderBase, "id"> implements FolderInterface {
        [OptionalProps]?: "createdAt" | "updatedAt" | "archived" | "children" | "numberOfFiles" | "files" | "numberOfChildFolders";

        @PrimaryKey({ columnType: "uuid" })
        @Field(() => ID)
        id: string = uuid();

        @Property({ columnType: "text" })
        @Field()
        name: string;

        @ManyToOne({
            entity: "Folder",
            inversedBy: (folder: FolderInterface) => folder.children,
            joinColumn: "parentId",
            nullable: true,
            cascade: [Cascade.ALL],
        })
        parent: FolderInterface | null;

        @OneToMany("Folder", (folder: FolderInterface) => folder.parent)
        children: FolderInterface[];

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

        @Property({ columnType: "boolean", default: false })
        @Field()
        isInboxFromOtherScope: boolean;

        @OneToMany("File", (file: FileInterface) => file.folder)
        files: FileInterface[];

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

    if (Scope) {
        @Entity({ tableName: FOLDER_TABLE_NAME })
        @ObjectType("DamFolder")
        class Folder extends FolderBase {
            @Embedded(() => Scope)
            @Field(() => Scope)
            scope: typeof Scope;

            @Field(() => Folder, { nullable: true })
            parent: Folder | null;
        }
        return Folder;
    } else {
        @Entity({ tableName: FOLDER_TABLE_NAME })
        @ObjectType("DamFolder")
        class Folder extends FolderBase {
            @Field(() => Folder, { nullable: true })
            parent: Folder | null;
        }
        return Folder;
    }
}

export const FOLDER_TABLE_NAME = "DamFolder";
