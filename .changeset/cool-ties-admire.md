---
"@comet/site-nextjs": minor
"@comet/site-react": minor
---

Block Loader: infer `LoadedData` from loader return type

Use the new `BlockLoaderOptions` type to allow inferring the type type from the loader function.

**Before**

```ts
export const loader: BlockLoader<NewsLinkBlockData> = async ({ blockData, graphQLFetch }): Promise<LoadedData | null> => {
    // ...
};

export interface LoadedData {
    title: string;
}
```

**After**

```ts
export const loader = async ({ blockData, graphQLFetch }: BlockLoaderOptions<NewsLinkBlockData>) => {
    // ...
};

export type LoadedData = Awaited<ReturnType<typeof loader>>;
```
