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
} from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { EntityInfo } from "../../../common/entityInfo/entity-info.decorator";
import { CreateWarnings } from "../../../warnings/decorators/create-warnings.decorator";
import { DamScopeInterface } from "../../types";
import { FileWarningService } from "../file-warning.service";
import { FilesEntityInfoService } from "../files-entity-info.service";
import { DamFileImage } from "./file-image.entity";
import { FolderInterface } from "./folder.entity";
import { License } from "./license.embeddable";

export interface FileInterface extends BaseEntity {
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
    image?: DamFileImage;
    license?: License;
    createdAt: Date;
    updatedAt: Date;
    scope?: DamScopeInterface;
    importSourceId?: string;
    importSourceType?: string;
}

export function createFileEntity({ Scope, Folder }: { Scope?: Type<DamScopeInterface>; Folder: Type<FolderInterface> }): Type<FileInterface> {
    @Entity({ abstract: true })
    @ObjectType({ isAbstract: true })
    @CreateWarnings(FileWarningService)
    class FileBase extends BaseEntity implements FileInterface {
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
        @Property({ type: new BigIntType("number") })
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
        })
        archived: boolean = false;

        @Field(() => DamFileImage, { nullable: true })
        @OneToOne({
            entity: () => DamFileImage,
            inversedBy: (image) => image.file,
            joinColumn: "imageId",
            nullable: true,
            cascade: [Cascade.ALL],
            eager: true,
        })
        image?: DamFileImage;

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

        @Field({ nullable: true })
        @Property({ columnType: "text", nullable: true })
        importSourceId?: string;

        @Field({ nullable: true })
        @Property({ columnType: "text", nullable: true })
        importSourceType?: string;

        // fileUrl: Field is resolved in resolver
    }

    if (Scope) {
        @EntityInfo<DamFile>(FilesEntityInfoService)
        @Entity({ tableName: FILE_TABLE_NAME })
        @ObjectType("DamFile")
        class DamFile extends FileBase {
            @Embedded(() => Scope)
            @Field(() => Scope)
            scope: typeof Scope;
        }
        return DamFile;
    } else {
        @EntityInfo<DamFile>(FilesEntityInfoService)
        @Entity({ tableName: FILE_TABLE_NAME })
        @ObjectType("DamFile")
        class DamFile extends FileBase {}
        return DamFile;
    }
}

export const FILE_ENTITY = "DamFile";

export const FILE_TABLE_NAME = "DamFile";
