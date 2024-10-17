---
"@comet/cms-api": minor
---

Set content scopes in request object

This allows accessing the affected content scopes inside a block's transformer service.

**Example**

```ts
import { Inject, Injectable } from "@nestjs/common";
import { CONTEXT } from "@nestjs/graphql";

/* ... */

@Injectable()
export class PixelImageBlockTransformerService implements BlockTransformerServiceInterface<PixelImageBlockData, TransformResponse> {
    constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        @Inject(CONTEXT) private readonly context: any,
    ) {}

    async transformToPlain(block: PixelImageBlockData) {
        // Get the affected content scopes
        const contentScopes = this.context.req.contentScopes;

        // Do something with the content scopes

        /* ... */
    }
}
```
