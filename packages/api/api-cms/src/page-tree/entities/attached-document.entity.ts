import { BaseEntity, Entity, Index, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

@ObjectType()
@Entity({ tableName: "PageTreeNodeDocument" })
@Unique({ properties: ["pageTreeNodeId", "documentId"] })
export class AttachedDocument extends BaseEntity<AttachedDocument, "id"> {
    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property({ columnType: "uuid" })
    @Index()
    @Field(() => ID)
    pageTreeNodeId: string; // this can be no real entity since page tree node is only abstract

    @Property({ columnType: "text" })
    @Field()
    type: string; // a stricter type is not possible, since this can be extended inside the application

    @Property({ columnType: "uuid" })
    @Index()
    @Field(() => ID)
    documentId: string;
}
