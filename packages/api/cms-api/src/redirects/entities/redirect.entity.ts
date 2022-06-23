import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

import { DocumentInterface } from "../../document/dto/document-interface";
import { RedirectGenerationType, RedirectSourceTypeValues, RedirectTargetTypeValues } from "../redirects.enum";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
export class Redirect extends BaseEntity<Redirect, "id"> implements DocumentInterface {
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

    @Enum(() => RedirectTargetTypeValues)
    @Field(() => RedirectTargetTypeValues)
    targetType: RedirectTargetTypeValues;

    @Property({
        columnType: "text",
        nullable: true,
    })
    @Field({ nullable: true })
    targetUrl?: string;

    @Property({
        columnType: "uuid",
        nullable: true,
    })
    @Field({ nullable: true })
    targetPageId?: string;

    // @TODO: make a relation to the concrete PageTreeNodez
    //
    // @OneToOne(() => PageTreeNode, { nullable: true, onDelete: "CASCADE", createForeignKeyConstraints: false })
    // @JoinColumn()
    // @Index()
    // @Field(() => PageTreeNode, { nullable: true })
    // targetPage?: PageTreeNode;

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
