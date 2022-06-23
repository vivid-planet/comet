import { BaseEntity, Embedded, Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

import { ImageCropArea } from "../../images/entities/image-crop-area.entity";
import { File } from "./file.entity";

@Entity({ tableName: "DamFileImage" })
@ObjectType("DamFileImage")
export class FileImage extends BaseEntity<FileImage, "id"> {
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property({ columnType: "integer" })
    @Field(() => Int)
    width: number;

    @Property({ columnType: "integer" })
    @Field(() => Int)
    height: number;

    @Property({ type: "json", nullable: true })
    @Field(() => GraphQLJSONObject, { nullable: true })
    exif?: Record<string, number | string | Array<number> | Uint8Array | Uint16Array>;

    @Property({ columnType: "text", nullable: true })
    @Field({ nullable: true })
    dominantColor?: string;

    @Embedded(() => ImageCropArea)
    @Field(() => ImageCropArea)
    cropArea: ImageCropArea;

    @OneToOne({ entity: () => File, mappedBy: (file) => file.image, onDelete: "CASCADE" })
    file: File;
}
