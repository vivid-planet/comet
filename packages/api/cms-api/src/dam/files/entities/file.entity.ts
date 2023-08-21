import {
    BaseEntity,
    BigIntType,
    Cascade,
    Embedded,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    OneToOne,
    OptionalProps,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { DamScopeInterface } from "../../types";
import { FileImage } from "./file-image.entity";
import { FolderInterface } from "./folder.entity";
import { License } from "./license.embeddable";

export interface FileInterface extends BaseEntity<FileInterface, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "archived" | "copies";
    id: string;
    folder?: FolderInterface;
    name: string;
    size: number;
    mimetype: string;
    contentHash: string;
    title?: string;
    altText?: string;
    archived: boolean;
    copyOf?: FileInterface;
    copies: FileInterface[];
    image?: FileImage;
    license?: License;
    createdAt: Date;
    updatedAt: Date;
    scope?: DamScopeInterface;
}

export function createFileEntity({ Scope, Folder }: { Scope?: Type<DamScopeInterface>; Folder: Type<FolderInterface> }): Type<FileInterface> {
    @Entity({ abstract: true })
    @ObjectType({ isAbstract: true })
    class FileBase extends BaseEntity<FileBase, "id"> implements FileInterface {
        @PrimaryKey({ columnType: "uuid" })
        @Field(() => ID)
        id: string = uuid();

        @Field(() => Folder, { nullable: true })
        @ManyToOne({
            entity: () => Folder,
            inversedBy: (folder: FolderInterface) => folder.files,
            joinColumn: "folderId",
            nullable: true,
        })
        folder?: FolderInterface;

        @Field()
        @Property({ columnType: "text" })
        name: string;

        @Field(() => Int)
        @Property({ type: BigIntType })
        size: number;

        @Field()
        @Property({ columnType: "text" })
        mimetype: string;

        @Field()
        @Property({ columnType: "character(32)" })
        @Index()
        contentHash: string;

        @ManyToOne({
            entity: FILE_ENTITY,
            inversedBy: (file: FileInterface) => file.copies,
            joinColumn: "copyOfId",
            nullable: true,
        })
        copyOf?: FileInterface;

        @OneToMany(FILE_ENTITY, (file: FileInterface) => file.copyOf)
        copies: FileInterface[];

        @Field({ nullable: true })
        @Property({
            columnType: "text",
            nullable: true,
        })
        title?: string;

        @Field({ nullable: true })
        @Property({
            columnType: "text",
            nullable: true,
        })
        altText?: string;

        @Field()
        @Property({
            columnType: "boolean",
            default: false,
        })
        archived: boolean;

        @Field(() => FileImage, { nullable: true })
        @OneToOne({
            entity: () => FileImage,
            inversedBy: (image) => image.file,
            joinColumn: "imageId",
            nullable: true,
            cascade: [Cascade.ALL],
            eager: true,
        })
        image?: FileImage;

        @Field(() => License, { nullable: true })
        @Embedded(() => License, { nullable: true })
        license?: License;

        @Property({
            columnType: "timestamp with time zone",
        })
        @Field()
        createdAt: Date = new Date();

        @Property({
            columnType: "timestamp with time zone",
            onUpdate: () => new Date(),
        })
        @Field()
        updatedAt: Date = new Date();

        // fileUrl: Field is resolved in resolver
    }

    if (Scope) {
        @Entity({ tableName: FILE_TABLE_NAME })
        @ObjectType("DamFile")
        class File extends FileBase {
            @Embedded(() => Scope)
            @Field(() => Scope)
            scope: typeof Scope;
        }
        return File;
    } else {
        @Entity({ tableName: FILE_TABLE_NAME })
        @ObjectType("DamFile")
        class File extends FileBase {}
        return File;
    }
}

export const FILE_ENTITY = "File";

export const FILE_TABLE_NAME = "DamFile";
