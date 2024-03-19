# Dependencies

## Register fields to be added to the block index

### Add `@RootBlockEntity()` and `@RootBlock()` decorators to entity

The entity needs to be annotated with `@RootBlockEntity()`.

All fields containing block data need to be annotated with `@RootBlock()`. The Block used by this field must be passed as an argument.

```ts
//...
@RootBlockEntity()
export class News extends BaseEntity<News, "id"> implements DocumentInterface {
    // ...

    @RootBlock(DamImageBlock)
    @Property({ customType: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    image: BlockDataInterface;

    @RootBlock(NewsContentBlock)
    @Property({ customType: new RootBlockType(NewsContentBlock) })
    @Field(() => RootBlockDataScalar(NewsContentBlock))
    content: BlockDataInterface;

    // ...
}
```

## Correctly display a dependency target

### 1. Add `@EntityInfo()` to entity (API)

You can provide the entity info in two ways:

#### `GetEntityInfo` Method

The simple way is to provide a function returning a `name` and (optional) `secondaryInformation` based on the entity instance.

```ts
// news.entity.ts
@EntityInfo<News>((news) => ({ name: news.title, secondaryInformation: news.slug }))
```

#### `EntityInfoService`

If you need to load additional information from a service or repository to provide the entity info, you can implement an `EntityInfoService`. In this service, you can use Nest's dependency injection.

The service must offer a `getEntityInfo()` method returning a `name` and (optional) `secondaryInformation`.

```ts
// file.entity.ts
@EntityInfo<DamFile>(FilesEntityInfoService)
```

```ts
// files-entity-info.service.ts
@Injectable()
export class FilesEntityInfoService implements EntityInfoServiceInterface<FileInterface> {
    constructor(
        @Inject(forwardRef(() => FilesService))
        private readonly filesService: FilesService,
    ) {}

    async getEntityInfo(file: FileInterface) {
        return { name: file.name, secondaryInformation: await this.filesService.getDamPath(file) };
    }
}
```

### 2. Implement the DependencyInterface (Admin)

The DependencyInterface requires a translatable `displayName` and a `getUrl()` method providing a URL to edit an entity or its blocks.

```ts
// NewsDependency.tsx
export const NewsDependency: DependencyInterface = {
    displayName: <FormattedMessage id="news.displayName" defaultMessage="News" />,
    resolveRoute: async ({ apolloClient, id, rootColumnName, jsonPath }) => {
        const { data, error } = await apolloClient.query<
            GQLNewsDependencyQuery,
            GQLNewsDependencyQueryVariables
        >({
            query: gql`
                query NewsDependency($id: ID!) {
                    news(id: $id) {
                        id
                        content
                    }
                }
            `,
            variables: {
                id,
            },
        });

        if (error) {
            throw new Error(`News.getUrl: Could not find a News with id ${id}`);
        }

        let dependencyRoute = "";
        if (rootColumnName === "content") {
            dependencyRoute = `form/${NewsContentBlock.resolveDependencyRoute(
                NewsContentBlock.input2State(data.news.content),
                jsonPath.substring("root.".length),
            )}`;
        }

        return `/structured-content/news/${data.news.id}/edit/${dependencyRoute}`;
    },
};
```

### 3. Register the DependencyInterface at the DependenciesConfigProvider

The key must be the name of the GraphQL object type associated with the entity.

```ts
// App.tsx
// ...
<DependenciesConfigProvider
    entityDependencyMap={{
        // ...
        News: NewsDependency,
    }}
>
    // ...
</DependenciesConfigProvider>
// ...
```
