import { ExtractBlockData, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudSingleGenerator, DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Embedded, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

import { FooterContentBlock } from "../blocks/footer-content.block";
import { FooterScope } from "../dto/footer-scope";

@Entity()
@ObjectType()
@RootBlockEntity()
@CrudSingleGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["pageTree"] })
export class Footer extends BaseEntity<Footer, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @RootBlock(FooterContentBlock)
    @Property({ customType: new RootBlockType(FooterContentBlock) })
    @Field(() => RootBlockDataScalar(FooterContentBlock))
    content: ExtractBlockData<typeof FooterContentBlock>;

    @Embedded(() => FooterScope)
    @Field(() => FooterScope)
    scope: FooterScope;

    @Property({ columnType: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({ columnType: "timestamp with time zone", onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
