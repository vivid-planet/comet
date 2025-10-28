import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { ProductListBlock } from "@src/products/blocks/product-list.block";
import { ProductType } from "@src/products/entities/product-type.enum";

@Injectable()
export class ProductListBlockFixtureService {
    constructor() {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ProductListBlock>> {
        return {
            types: faker.helpers.arrayElements(Object.values(ProductType)),
        };
    }
}
