import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { ProductList, ProductListBlock } from "@src/common/blocks/product-list.block";

@Injectable()
export class ProductListBlockFixtureService {
    constructor() {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ProductListBlock>> {
        return {
            products: faker.helpers.arrayElements(Object.values(ProductList)),
        };
    }
}
