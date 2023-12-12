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

```tsx

import { gql, useApolloClient } from "@apollo/client";

...

const client = useApolloClient();
const scope = useContentScope();

const translationFeature = new Map([
  ['scope1', 'targetLanguage1'],
  ['scope2', 'targetLanguage2'],
  ['scope3', 'targetLanguage3'],
]);

...

<TranslationConfigProvider
    enabled={translationFeature.has(scope)}
    translate={async function (value: string): Promise<string | void> {
        if (translationFeature.has(scope)) {
            const translation = await client.query<GQLTranslateQuery, GQLTranslateQueryVariables>({
                query: gql`
                    query Translate($value: String!, $language: String!) {
                        translate(value: $value, language: $language)
                    }
                `,
                variables: { value, language: translationFeature.get(scope) },
            });
            return translation.data.translate;
        }
    }}
>
```