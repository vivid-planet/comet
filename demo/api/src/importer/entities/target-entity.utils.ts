import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

export interface TargetEntityProperty {
    name: string;
    reference: string;
    nullable: boolean;
    type: string; // enum
    columnTypes: string[]; //[ 'integer' ],
}

export interface TargetEntityProperties {
    [key: string]: TargetEntityProperty;
}

export enum DataType {
    String = "String",
    Integer = "Integer",
    Float = "Float",
    Boolean = "Boolean",
    Date = "Date",
}

const getDataTypeTypeFromEntityPropertyMetadata = (property: TargetEntityProperty) => {
    switch (property.type) {
        case "string":
            return DataType.String;

        case "Date":
        case "DateType":
            return DataType.Date;

        case "boolean":
        case "BooleanType":
            return DataType.Boolean;

        case "IntegerType":
            return DataType.Integer;

        case "number":
            console.log("DEBUG property.columnTypes: ", property.columnTypes);
            if (property.columnTypes.includes("integer")) {
                return DataType.Integer;
            }
            return DataType.Float;

        default:
            break;
    }
};

export const columnIsString = (property: TargetEntityProperty) => getDataTypeTypeFromEntityPropertyMetadata(property) === DataType.String;
export const columnIsInteger = (property: TargetEntityProperty) => getDataTypeTypeFromEntityPropertyMetadata(property) === DataType.Integer;
export const columnIsFloat = (property: TargetEntityProperty) => getDataTypeTypeFromEntityPropertyMetadata(property) === DataType.Float;
export const columnIsBoolean = (property: TargetEntityProperty) => getDataTypeTypeFromEntityPropertyMetadata(property) === DataType.Boolean;
export const columnIsDate = (property: TargetEntityProperty) => getDataTypeTypeFromEntityPropertyMetadata(property) === DataType.Date;

export const isNullable = (property: TargetEntityProperty) => !!property.nullable;

export const getEntityProperties = (em: EntityManager<IDatabaseDriver<Connection>>, entityName: string): TargetEntityProperties => {
    const targetEntityMetadata = em.getMetadata(entityName);
    return targetEntityMetadata.properties;
};
