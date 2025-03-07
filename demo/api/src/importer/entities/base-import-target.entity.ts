import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

export interface BaseImportInterface {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

@ObjectType({ isAbstract: true, description: "Base import entity" })
@Entity({ abstract: true })
export abstract class BaseImportTargetEntity<Entity extends object, Primary extends keyof Entity>
    extends BaseEntity<Entity, Primary>
    implements BaseImportInterface
{
    @Field(() => ID)
    @PrimaryKey({ type: "uuid" })
    id: string = v4();
    @Field(() => Date, { nullable: true })
    @Property({
        type: "timestamp with time zone",
        nullable: true,
        onCreate: () => new Date(),
    })
    createdAt?: Date;
    @Field(() => Date, { nullable: true })
    @Property({
        type: "timestamp with time zone",
        nullable: true,
        onUpdate: () => new Date(),
    })
    updatedAt?: Date;
    @Field(() => Date, { nullable: true })
    @Property({
        type: "timestamp with time zone",
        nullable: true,
    })
    deletedAt?: Date;
}
