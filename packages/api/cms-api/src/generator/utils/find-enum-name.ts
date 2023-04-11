import { EntityMetadata } from "@mikro-orm/core";
import { TypeMetadataStorage } from "@nestjs/graphql";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findEnumName(metadata: EntityMetadata<any>, propertyName: string): string {
    const objectTypeMetadata = TypeMetadataStorage.getObjectTypesMetadata().find((i) => i.target == metadata.class);
    if (!objectTypeMetadata) throw new Error(`Can't find GraphQL Metadata for ${metadata.name}`);
    TypeMetadataStorage.compileClassMetadata([objectTypeMetadata]);
    const propertyMetaData = objectTypeMetadata.properties?.find((i) => i.name == propertyName);
    const enumType = propertyMetaData?.typeFn();
    const enumMetadata = TypeMetadataStorage.getEnumsMetadata().find((i) => i.ref == enumType);
    if (!enumMetadata) throw new Error(`Can't find GraphQL Enum Metadata for ${metadata.name}.${propertyName}`);
    const enumName = enumMetadata.name;
    return enumName;
}
