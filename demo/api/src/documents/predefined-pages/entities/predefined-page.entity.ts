import { DocumentInterface, PageTreeNodeDocumentEntityScopeService, ScopedEntity } from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

export enum PredefinedPageType {
    News = "News",
}

registerEnumType(PredefinedPageType, {
    name: "PredefinedPageType",
});

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@ScopedEntity(PageTreeNodeDocumentEntityScopeService)
export class PredefinedPage extends BaseEntity<PredefinedPage, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

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

    @Property({ columnType: "text", nullable: true })
    @Field(() => PredefinedPageType, { nullable: true })
    type?: PredefinedPageType | null;
}
