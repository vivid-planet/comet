import { BaseEntity, BigIntType, Cascade, Entity, Index, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { FileImage } from "./file-image.entity";
import { Folder } from "./folder.entity";

export const UniqueNameInFolderIndex = "IDX_unique_name_in_folder";
export const UniqueNameInRootFolderIndex = "IDX_unique_name_in_root_folder";

@ObjectType("DamFile")
@Entity({ tableName: "DamFile" })
// MikroORM doesn't support conditional indices (yet): https://github.com/mikro-orm/mikro-orm/issues/1029
// @Index({ name: UniqueNameInFolderIndex, properties: ["folder", "name"], options: { where: '"folderId" IS NOT NULL' }, unique: true })
// @Index({ name: UniqueNameInRootFolderIndex, properties: ["name"], where: '"folderId" IS NULL', unique: true })
export class File extends BaseEntity<File, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "archived";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Field(() => Folder, { nullable: true })
    @ManyToOne({
        entity: () => Folder,
        inversedBy: (folder) => folder.files,
        joinColumn: "folderId",
        nullable: true,
    })
    folder?: Folder;

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
