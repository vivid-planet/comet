import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudSingleGenerator, DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Embedded, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { FooterContentBlock } from "../blocks/footer-content.block";
import { FooterContentScope } from "./footer-content-scope.entity";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@CrudSingleGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["pageTree"] })
export class Footer extends BaseEntity<Footer, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();
    @RootBlock(FooterContentBlock)
    @Property({ customType: new RootBlockType(FooterContentBlock) })
    @Field(() => RootBlockDataScalar(FooterContentBlock))
    content: BlockDataInterface;

    @Embedded(() => FooterContentScope)
    @Field(() => FooterContentScope)
    scope: FooterContentScope;

    @Property({ columnType: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({ columnType: "timestamp with time zone", onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
