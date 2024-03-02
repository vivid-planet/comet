import { CrudGenerator, IsNullable } from "@comet/cms-api";
import { BaseEntity, Embeddable, Embedded, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsObject, IsString } from "class-validator";
import { v4 as uuid } from "uuid";

@ObjectType()
@InputType("AlternativeAddressInput")
export class AlternativeAddress {
    @Field()
    @Property()
    @IsString()
    street: string;

    @Field(() => Number, { nullable: true })
    @Property({ nullable: true })
    @IsNumber()
    @IsNullable()
    streetNumber?: number = undefined;

    @Field()
    @Property()
    @IsNumber()
    zip: number;

    @Field()
    @Property()
    @IsString()
    country: string;
}

@ObjectType()
@InputType("AddressInput")
export class Address extends AlternativeAddress {
    @Property({ type: "json", nullable: true })
    @Field(() => AlternativeAddress, { nullable: true })
    @IsObject()
    alternativeAddress?: AlternativeAddress = undefined;
}

@Embeddable()
@ObjectType()
@InputType("AlternativeAddressAsEmbeddableInput")
export class AlternativeAddressAsEmbeddable {
    @Field()
    @Property()
    @IsString()
    street: string;

    @Field(() => Number, { nullable: true })
    @Property({ nullable: true })
    @IsNumber()
    @IsNullable()
    streetNumber?: number = undefined;

    @Field()
    @Property()
    @IsNumber()
    zip: number;

    @Field()
    @Property()
    @IsString()
    country: string;
}

@Embeddable()
@ObjectType()
@InputType("AddressAsEmbeddableInput")
export class AddressAsEmbeddable extends AlternativeAddressAsEmbeddable {
    @Embedded(() => AlternativeAddressAsEmbeddable)
    @Field(() => AlternativeAddressAsEmbeddable)
    @IsObject()
    alternativeAddress: AlternativeAddressAsEmbeddable;
}

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Manufacturer extends BaseEntity<Manufacturer, "id"> {
    [OptionalProps]?: "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property({ type: "json", nullable: true })
    @Field(() => Address, { nullable: true })
    address?: Address = undefined;

    @Embedded(() => AddressAsEmbeddable) // Embedded can only be optional if all contained properties are optional
    @Field(() => AddressAsEmbeddable)
    addressAsEmbeddable: AddressAsEmbeddable;

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
