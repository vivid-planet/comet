---
"@comet/blocks-api": major
"@comet/cms-api": major
---

Support "real" dependency injection in `BlockData#transformToPlain`

Previously we supported poor man's dependency injection using the `TransformDependencies` object in `transformToPlain`.
This is now replaced by a technique that allows actual dependency injection.

**Example**

```ts
class NewsLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    id?: string;

    transformToPlain() {
        // Return service that does the transformation
        return NewsLinkBlockTransformerService;
    }
}

type TransformResponse = {
    news?: {
        id: string;
        slug: string;
    };
};

@Injectable()
class NewsLinkBlockTransformerService implements BlockTransformerServiceInterface<NewsLinkBlockData, TransformResponse> {
    // Use dependency injection here
    constructor(@InjectRepository(News) private readonly repository: EntityRepository<News>) {}

    async transformToPlain(block: NewsLinkBlockData, context: BlockContext) {
        if (!block.id) {
            return {};
        }

        const news = await this.repository.findOneOrFail(block.id);

        return {
            news: {
                id: news.id,
                slug: news.slug,
            },
        };
    }
}
```

Adding this new technique results in a few breaking changes:

-   Remove dynamic registration of `BlocksModule`
-   Pass `moduleRef` to `BlocksTransformerMiddlewareFactory` instead of `dependencies`
-   Remove `dependencies` from `BlockData#transformToPlain`

See the [migration guide](https://docs.comet-dxp.com/docs/migration/migration-from-v6-to-v7) on how to migrate.
