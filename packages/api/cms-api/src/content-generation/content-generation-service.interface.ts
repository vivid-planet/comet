import { Field, ObjectType } from "@nestjs/graphql";
import { getFieldsAndDecoratorForType } from "@nestjs/graphql/dist/schema-builder/utils/get-fields-and-decorator.util";

export interface ContentGenerationServiceInterface {
    generateAltText?(fileId: string): Promise<string>;
    generateImageTitle?(fileId: string): Promise<string>;
    generateSeoTags?(content: string): Promise<SeoTags>;
}

@ObjectType()
export class SeoTags {
    @Field()
    htmlTitle: string;

    @Field()
    metaDescription: string;

    @Field()
    ogTitle: string;

    @Field()
    ogDescription: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateObjectAgainstSeoTags(obj: { [key: string]: any }): obj is SeoTags {
    const { fields } = getFieldsAndDecoratorForType(SeoTags);
    const requiredKeys = fields.map((field) => field.name);

    for (const key of requiredKeys) {
        if (!Object.hasOwn(obj, key) || typeof obj[key] !== "string") {
            return false;
        }
    }

    return true;
}
