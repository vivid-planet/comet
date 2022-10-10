import { Block, BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

import { RootBlockType } from "../../blocks/root-block-type";
import { DocumentInterface } from "../../document/dto/document-interface";
import { RedirectGenerationType, RedirectSourceTypeValues } from "../redirects.enum";

export interface RedirectInterface extends BaseEntity<RedirectInterface, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt" | "active";
    id: string;
    sourceType: RedirectSourceTypeValues;
    source: string;
    target: BlockDataInterface;
    comment?: string;
    active: boolean;
    generationType: RedirectGenerationType;
    createdAt: Date;
    updatedAt: Date;
}

export class RedirectEntityFactory {
    static create(linkBlock: Block): Type<RedirectInterface> {
        @Entity()
        @ObjectType({
            implements: () => [DocumentInterface],
        })
        @RootBlockEntity()
        class Redirect extends BaseEntity<Redirect, "id"> implements RedirectInterface, DocumentInterface {
            [OptionalProps]?: "createdAt" | "updatedAt" | "active";

            @PrimaryKey({ columnType: "uuid" })
            @Field(() => ID)
            id: string = v4();

            @Enum(() => RedirectSourceTypeValues)
            @Field(() => RedirectSourceTypeValues)
            sourceType: RedirectSourceTypeValues;

            @Property({
                columnType: "text",
            })
            @Field()
            source: string;

            @RootBlock(linkBlock)
            @Property({ customType: new RootBlockType(linkBlock) })
            @Field(() => GraphQLJSONObject)
            target: BlockDataInterface;

            @Property({
                columnType: "text",
                nullable: true,
            })
            @Field({ nullable: true })
            comment?: string;

            @Property({ default: true })
            @Field()
            active: boolean;

            @Enum(() => RedirectGenerationType)
            @Field(() => RedirectGenerationType)
            generationType: RedirectGenerationType;

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
        }

        return Redirect;
    }
}
