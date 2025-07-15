import { DamImageBlock } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { Product, ProductStatus } from "@src/products/entities/product.entity";
import { ProductType } from "@src/products/entities/product-type.enum";

@Injectable()
export class ProductsFixtureService {
    private logger = new Logger(ProductsFixtureService.name);

    constructor(
        private readonly entityManager: EntityManager,
        @InjectRepository(Manufacturer) private readonly manufacturersRepository: EntityRepository<Manufacturer>,
        @InjectRepository(Product) private readonly productsRepository: EntityRepository<Product>,
    ) {}

    async generate(): Promise<void> {
        this.logger.log("Generating manufacturers...");

        const manufacturers: Manufacturer[] = [];

        for (let i = 0; i < 10; i++) {
            const manufacturer = this.manufacturersRepository.create({
                id: faker.datatype.uuid(),
                name: faker.company.name(),
                address: {
                    street: faker.address.street(),
                    streetNumber: Number(faker.address.buildingNumber()),
                    zip: Number(faker.address.zipCode("####")),
                    country: faker.address.country(),
                    alternativeAddress: {
                        street: faker.address.street(),
                        streetNumber: Number(faker.address.buildingNumber()),
                        zip: Number(faker.address.zipCode("####")),
                        country: faker.address.country(),
                    },
                },
                addressAsEmbeddable: {
                    street: faker.address.street(),
                    streetNumber: Number(faker.address.buildingNumber()),
                    zip: Number(faker.address.zipCode("####")),
                    country: faker.address.country(),
                    alternativeAddress: {
                        street: faker.address.street(),
                        streetNumber: Number(faker.address.buildingNumber()),
                        zip: Number(faker.address.zipCode("####")),
                        country: faker.address.country(),
                    },
                },
            });

            this.entityManager.persist(manufacturer);

            manufacturers.push(manufacturer);
        }

        for (let i = 0; i < 100; i++) {
            const title = faker.commerce.productName();

            const product = this.productsRepository.create({
                id: faker.datatype.uuid(),
                title: faker.commerce.productName(),
                status: faker.helpers.arrayElement([ProductStatus.Published, ProductStatus.Unpublished]),
                slug: faker.helpers.slugify(title),
                description: faker.commerce.productDescription(),
                type: faker.helpers.arrayElement([ProductType.cap, ProductType.shirt, ProductType.tie]),
                additionalTypes: [],
                price: faker.datatype.number(),
                inStock: faker.datatype.boolean(),
                soldCount: faker.datatype.number(),
                availableSince: faker.date.past(),
                image: DamImageBlock.blockInputFactory({ attachedBlocks: [] }).transformToBlockData(),
                manufacturer: faker.helpers.arrayElement(manufacturers),
            });

            this.entityManager.persist(product);
        }
    }
}
