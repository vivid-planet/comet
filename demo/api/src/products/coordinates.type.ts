import { Type } from "@mikro-orm/postgresql";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("CoordinatesInput")
export class Coordinates {
    @Field()
    latitude: number;

    @Field()
    longitude: number;
}

export class CoordinatesType extends Type<Coordinates, string> {
    convertToDatabaseValue(value: Coordinates): string {
        return `(${value.latitude},${value.longitude})`;
    }

    convertToJSValue(value: string): Coordinates {
        const match = value.match(/\(([^,]+),([^)]+)\)/);
        if (!match) throw new Error("Invalid coordinate format");
        return {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
        };
    }

    getColumnType(): string {
        return "point";
    }
}
