---
"@comet/cms-api": minor
---

API Generator: Allow easier extension of generated resolvers and services

Even though we don't encourage to extend generated resolvers and services, it should still be possible. Our recommendation is to generate a new resolver but there are cases where it makes sense to extend the existing one (e.g. modifying certain functions or reuseing existing code).

Until now, this was hard to do, because every resolver and service declared it's services as private. If you need to use a service from the base resolver, you had to redeclare all services with a different name.

```ts
    constructor(
        entityManager: EntityManager,
        @InjectRepository(Product) private readonly repository2: EntityRepository<Product>,
        @InjectRepository(ProductCategory) private readonly productCategoryRepository2: EntityRepository<ProductCategory>,
        @InjectRepository(Manufacturer) private readonly manufacturerRepository2: EntityRepository<Manufacturer>,
        @InjectRepository(FileUpload) private readonly fileUploadRepository2: EntityRepository<FileUpload>,
        @InjectRepository(ProductStatistics) private readonly productStatisticsRepository2: EntityRepository<ProductStatistics>,
        @InjectRepository(ProductColor) private readonly productColorRepository2: EntityRepository<ProductColor>,
        @InjectRepository(ProductToTag) private readonly productToTagRepository2: EntityRepository<ProductToTag>,
        @InjectRepository(ProductTag) private readonly productTagRepository2: EntityRepository<ProductTag>,
        private readonly blocksTransformer2: BlocksTransformerService,
    ) {
        super(
            entityManager,
            repository2,
            productCategoryRepository2,
            manufacturerRepository2,
            fileUploadRepository2,
            productStatisticsRepository2,
            productColorRepository2,
            productToTagRepository2,
            productTagRepository2,
            blocksTransformer2,
        );
    }

```

If you tried to use the same name you got the following error:

```
Class 'CustomProductResolver' incorrectly extends base class 'ProductResolver'.
  Types have separate declarations of a private property 'repository'.ts(2415)
```

Now, the constructor can be ommitted and the custom resolver can be simplified to:

```ts
@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class CustomProductResolver extends ProductResolver {
    @Mutation(() => Boolean)
    async publishAllProducts(): Promise<boolean> {
        await this.repository.nativeUpdate({ status: { $ne: ProductStatus.Published } }, { status: ProductStatus.Published });
        return true;
    }
}
```
