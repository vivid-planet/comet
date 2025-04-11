import { Type } from "@mikro-orm/postgresql";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";

@ObjectType()
@InputType("CustomProductInput")
export class CustomProduct {
    @Field()
    custom: string;
}

export class CustomProductType extends Type<CustomProduct, string> {
    convertToDatabaseValue(value: CustomProduct): string {
        return value.custom;
    }

    convertToJSValue(value: string): CustomProduct {
        return plainToInstance(CustomProduct, { custom: value });
    }

    getColumnType(): string {
        return "text";
    }
}
