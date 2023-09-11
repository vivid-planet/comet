import { EntityRepository } from "@mikro-orm/postgresql";
import { ShopProduct } from "@src/shop-products/entities/shop-product.entity";
import faker from "faker";
import { v4 } from "uuid";

export const generateShopProduct = async (shopProductsRepository: EntityRepository<ShopProduct>, categoryId: string): Promise<string> => {
    const uuid = v4();
    await shopProductsRepository.persistAndFlush(
        shopProductsRepository.create({
            id: uuid,
            name: faker.lorem.word(),
            description: faker.lorem.sentence(),
        }),
    );
    return uuid;
};
