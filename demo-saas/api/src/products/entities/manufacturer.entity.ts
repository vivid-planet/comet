import { CrudField, CrudGenerator, IsNullable, IsUndefinable } from "@comet/cms-api";
import { BaseEntity, Embeddable, Embedded, Entity, IType, ManyToOne, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { Tenant } from "@src/tenant/entities/tenant.entity";
import { IsNumber, IsObject, IsString } from "class-validator";
import { v4 as uuid } from "uuid";

import { Coordinates, CoordinatesType } from "../coordinates.type";

@ObjectType()
@InputType("AlternativeAddressInput")
export class AlternativeAddress {
    @Field()
    @Property()
    @IsString()
    street: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    @IsNumber()
    @IsNullable()
    streetNumber?: number = undefined;

    @Field()
    @Property()
    @IsString()
    zip: string;

    @Field()
    @Property()
    @IsString()
    country: string;
}

@ObjectType()
@InputType("AddressInput")
export class Address extends AlternativeAddress {
    @IsNullable()
    @Property({ type: "json", nullable: true })
    @Field(() => AlternativeAddress, { nullable: true })
    @IsObject()
    @IsUndefinable()
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

    @Field({ nullable: true })
    @Property({ nullable: true })
    @IsNumber()
    @IsNullable()
    streetNumber?: number = undefined;

    @Field()
    @Property()
    @IsString()
    zip: string;

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
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["manufacturers"] })
export class Manufacturer extends BaseEntity {
    [OptionalProps]?: "updatedAt" | "tenant";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    name: string;

    @Property({ type: "json", nullable: true })
    @Field(() => Address, { nullable: true })
    address?: Address = undefined;

    @Embedded(() => AddressAsEmbeddable) // Embedded can only be optional if all contained properties are optional
    @Field(() => AddressAsEmbeddable)
    addressAsEmbeddable: AddressAsEmbeddable;

    @Property({ type: CoordinatesType, nullable: true })
    @Field(() => Coordinates, { nullable: true })
    coordinates?: IType<Coordinates, string>;

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();

    @ManyToOne(() => Tenant, { nullable: false, ref: true })
    @Field(() => Tenant)
    @CrudField({
        input: false,
    })
    tenant: Ref<Tenant>;
}
