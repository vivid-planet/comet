---
"@comet/cms-api": minor
---

Adds translation module to which you can provide a translation service handling the translation.


```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectTranslationService {
    public async translate(value: string, language?: string): Promise<string> {
        const translation = ...
        return translation;
    }
}
```

```ts
imports: [
    ...
    TranslationModule.register({ service: new ProjectTranslationService() }),
    ...
]
```

```ts

import { gql, useApolloClient } from "@apollo/client";

...

const client = useApolloClient();

...

 <TranslationConfigProvider
    value={{
        enableTranslation: true,
        translate: async (value: string, language?: string) => {
            const translation = await client.query<GQLTranslateQuery, GQLTranslateQueryVariables>({
                query: gql`
                    query Translate($value: String!, $language: String) {
                        translate(value: $value, language: $language)
                    }
                `,
                variables: { value },
            });
            return translation.data.translate;
        },
    }}
>
```