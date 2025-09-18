import { Embedded, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { v4 as uuid } from "uuid";

import { Block, BlockDataInterface } from "../../blocks/block.js";
import { RootBlock } from "../../blocks/decorators/root-block.js";
import { RootBlockEntity } from "../../blocks/decorators/root-block-entity.js";
import { RootBlockType } from "../../blocks/root-block-type.js";
import { RedirectGenerationType, RedirectSourceTypeValues } from "../redirects.enum.js";
import { RedirectScopeInterface } from "../types.js";

export interface RedirectInterface {
    [OptionalProps]?: "createdAt" | "updatedAt" | "active";
    id: string;
    sourceType: RedirectSourceTypeValues;
    source: string;
    target: BlockDataInterface;
    comment?: string;
    active: boolean;
    activatedAt?: Date;
    generationType: RedirectGenerationType;
    createdAt: Date;
    updatedAt: Date;
    scope?: RedirectScopeInterface;
}

export class RedirectEntityFactory {
    static create({ linkBlock, Scope: RedirectScope }: { linkBlock: Block; Scope?: Type<RedirectScopeInterface> }): Type<RedirectInterface> {
        @Entity({ abstract: true })
        @ObjectType({ isAbstract: true })
        class RedirectBase implements RedirectInterface {
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
            @Property({ type: new RootBlockType(linkBlock) })
            @Field(() => GraphQLJSONObject)
            target: BlockDataInterface;

            @Property({
                columnType: "text",
                nullable: true,
            })
            @Field({ nullable: true })
            comment?: string;

            @Property()
            @Field()
            active: boolean = true;

            @Property({
                columnType: "timestamp with time zone",
                nullable: true,
            })
            @Field({ nullable: true })
            activatedAt?: Date = new Date();

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
            @ObjectType()
            @RootBlockEntity()
            class Redirect extends RedirectBase {
                @Embedded(() => RedirectScope)
                @Field(() => RedirectScope)
                scope: typeof RedirectScope;
            }
            return Redirect;
        } else {
            @Entity()
            @ObjectType()
            @RootBlockEntity()
            class Redirect extends RedirectBase {}
            return Redirect;
        }
    }
}
