---
title: Redirects
---

## Custom redirect targets

Custom redirect targets (e.g., a news site) are supported via the `customTargets`-option.
The option expects a block:

```ts title=app.module.ts
RedirectsModule.register({
    // highlight-next-line
    customTargets: { news: NewsLinkBlock },
});
```

```tsx title=App.tsx
const RedirectsPage = createRedirectsPage({
    // highlight-next-line
    customTargets: { news: NewsLinkBlock },
});
```

A custom target URL service is required to resolve the target URLs:

```ts title=my-redirect-target-url.service.ts
@Injectable({ scope: Scope.REQUEST })
export class MyRedirectTargetUrlService implements RedirectTargetUrlServiceInterface {
    constructor() {}

    async resolveTargetUrl(
        target: ExtractBlockData<RedirectsLinkBlock>["attachedBlocks"][number],
    ): Promise<string | undefined> {
        if (target.type === "internal") {
            const targetPageId = (target.props as ExtractBlockData<typeof InternalLinkBlock>)
                .targetPageId;

            if (targetPageId) {
                const targetPageNode = await this.pageTreeReadApi.getNode(targetPageId);

                if (!targetPageNode) {
                    return undefined;
                }

                return this.pageTreeReadApi.nodePath(targetPageNode);
            }
        } else if (target.type === "external") {
            return (target.props as ExtractBlockData<typeof ExternalLinkBlock>).targetUrl;
        } else if (target.type === "news") {
            const newsId = (target.props as ExtractBlockData<typeof NewsLinkBlock>).id;

            if (newsId) {
                const news = await this.newsRepository.findOne(newsId);

                if (!news) {
                    return undefined;
                }

                return `/news/${news.slug}`;
            }
        }
    }
}
```

```ts title=app.module.ts
RedirectsModule.register({
    customTargets: { news: NewsLinkBlock },
    // highlight-next-line
    targetUrlService: MyRedirectTargetUrlService,
}),
```
