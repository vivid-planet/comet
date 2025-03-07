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
