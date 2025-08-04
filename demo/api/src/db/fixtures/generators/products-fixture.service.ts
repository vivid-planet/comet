import { DamImageBlock } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { Product, ProductStatus } from "@src/products/entities/product.entity";
import { ProductType } from "@src/products/entities/product-type.enum";
import { format } from "date-fns";

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
                id: faker.string.uuid(),
                name: faker.company.name(),
                address: {
                    street: faker.location.street(),
                    streetNumber: Number(faker.location.buildingNumber()),
                    zip: faker.location.zipCode("####"),
                    country: faker.location.country(),
                    alternativeAddress: {
                        street: faker.location.street(),
                        streetNumber: Number(faker.location.buildingNumber()),
                        zip: faker.location.zipCode("####"),
                        country: faker.location.country(),
                    },
                },
                addressAsEmbeddable: {
                    street: faker.location.street(),
                    streetNumber: Number(faker.location.buildingNumber()),
                    zip: faker.location.zipCode("####"),
                    country: faker.location.country(),
                    alternativeAddress: {
                        street: faker.location.street(),
                        streetNumber: Number(faker.location.buildingNumber()),
                        zip: faker.location.zipCode("####"),
                        country: faker.location.country(),
                    },
                },
            });

            this.entityManager.persist(manufacturer);

            manufacturers.push(manufacturer);
        }

        for (let i = 0; i < 100; i++) {
            const title = faker.commerce.productName();

            const product = this.productsRepository.create({
                id: faker.string.uuid(),
                title: faker.commerce.productName(),
                status: faker.helpers.arrayElement([ProductStatus.Published, ProductStatus.Unpublished]),
                slug: faker.helpers.slugify(title),
                description: faker.commerce.productDescription(),
                type: faker.helpers.arrayElement([ProductType.cap, ProductType.shirt, ProductType.tie]),
                additionalTypes: [],
                price: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
                inStock: faker.datatype.boolean(),
                soldCount: faker.number.int({ min: 0, max: 100 }),
                availableSince: format(faker.date.past(), "yyyy-MM-dd"),
                image: DamImageBlock.blockInputFactory({
                    attachedBlocks: [{ type: "pixelImage", props: {} }],
                    activeType: "pixelImage",
                }).transformToBlockData(),
                manufacturer: faker.helpers.arrayElement(manufacturers),
            });

            this.entityManager.persist(product);
        }
    }
}
