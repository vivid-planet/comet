import { Block, BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { Embedded, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Type } from "@nestjs/common";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 as uuid } from "uuid";

import { RootBlockType } from "../../blocks/root-block-type";
import { DocumentInterface } from "../../document/dto/document-interface";
import { RedirectGenerationType, RedirectSourceTypeValues } from "../redirects.enum";
import { RedirectScopeInterface } from "../types";

export interface RedirectInterface {
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
    scope?: RedirectScopeInterface;
}

export class RedirectEntityFactory {
    static create({ linkBlock, Scope: RedirectScope }: { linkBlock: Block; Scope?: Type<RedirectScopeInterface> }): Type<RedirectInterface> {
        @Entity({ abstract: true })
        @ObjectType({
            implements: () => [DocumentInterface],
            isAbstract: true,
        })
        class RedirectBase implements RedirectInterface, DocumentInterface {
            [OptionalProps]?: "createdAt" | "updatedAt" | "active";

            @PrimaryKey({ columnType: "uuid" })
            @Field(() => ID)
            id: string = uuid();

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

        if (RedirectScope) {
            @Entity()
            @ObjectType({
                implements: () => [DocumentInterface],
            })
            @RootBlockEntity()
            class Redirect extends RedirectBase {
                @Embedded(() => RedirectScope)
                @Field(() => RedirectScope)
                scope: typeof RedirectScope;
            }
            return Redirect;
        } else {
            @Entity()
            @ObjectType({
                implements: () => [DocumentInterface],
            })
            @RootBlockEntity()
            class Redirect extends RedirectBase {}
            return Redirect;
        }
    }
}
