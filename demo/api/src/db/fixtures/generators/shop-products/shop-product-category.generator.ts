import { EntityRepository } from "@mikro-orm/postgresql";
import { ShopProductCategory } from "@src/shop-products/entities/shop-product-category.entitiy";
import faker from "faker";
import { v4 } from "uuid";

export const generateShopProductCategory = async (shopProductCategoriesRepository: EntityRepository<ShopProductCategory>): Promise<string> => {
    const uuid = v4();
    await shopProductCategoriesRepository.persistAndFlush(
        shopProductCategoriesRepository.create({
            id: uuid,
            name: faker.lorem.word(),
            description: faker.lorem.sentence(),
        }),
    );
    return uuid;
};
