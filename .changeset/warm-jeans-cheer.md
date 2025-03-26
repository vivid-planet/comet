---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add support for searching/filtering redirects by target

Add a custom target URL service to resolve the URLs of custom redirect targets:

```ts
@Injectable({ scope: Scope.REQUEST })
export class MyRedirectTargetUrlService implements RedirectTargetUrlServiceInterface {
    constructor() {}

    async resolveTargetUrl(target: ExtractBlockData<RedirectsLinkBlock>["attachedBlocks"][number]): Promise<string | undefined> {
        // Your custom logic here
    }
}
```

```diff
RedirectsModule.register({
    imports: [MikroOrmModule.forFeature([News]), PredefinedPagesModule],
    customTargets: { news: NewsLinkBlock },
    Scope: RedirectScope,
+   TargetUrlService: MyRedirectTargetUrlService,
}),
```
