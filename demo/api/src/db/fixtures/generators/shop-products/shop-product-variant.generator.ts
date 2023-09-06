import { EntityRepository } from "@mikro-orm/postgresql";
import { ShopProductVariant } from "@src/shop-products/entities/shop-product-variant.entity";
import faker from "faker";
import { v4 } from "uuid";

export const generateShopProductVariant = async (
    shopProductVariantsRepository: EntityRepository<ShopProductVariant>,
    productId: string,
): Promise<void> => {
    const colors = ["red", "blue", "green", "yellow", "black", "white"];
    const sizes = ["S", "M", "L", "XL", "XXL"];

    await shopProductVariantsRepository.persistAndFlush(
        shopProductVariantsRepository.create({
            id: v4(),
            product: productId,
            name: faker.lorem.word(),
            size: sizes[Math.floor(Math.random() * sizes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            price: Math.random() * 100,
        }),
    );
};
