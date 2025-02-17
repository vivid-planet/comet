import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

export interface ContentGenerationServiceInterface {
    generateAltText?(fileId: string): Promise<string>;
    generateImageTitle?(fileId: string): Promise<string>;
    generateSeoTags?(content: string): Promise<SeoTags>;
}

@ObjectType()
export class SeoTags {
    @Field()
    @IsString()
    htmlTitle: string;

    @Field()
    @IsString()
    metaDescription: string;

    @Field()
    @IsString()
    openGraphTitle: string;

    @Field()
    @IsString()
    openGraphDescription: string;
}
