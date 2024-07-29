---
"@comet/cms-admin": major
---

Rework `ContentScopeProvider` and `ContentScopeControls`

The content scope controls were changed to display all available combinations in a single select.

This requires a few breaking changes:

1. The `values` props of `ContentScopeProvider` has been changed to an array:

    **Before**

    ```ts
    const values: ContentScopeValues<ContentScope> = {
        domain: [
            { label: "Main", value: "main" },
            { label: "Secondary", value: "secondary" },
        ],
        language: [
            { label: "English", value: "en" },
            { label: "German", value: "de" },
        ],
    };
    ```

    **Now**

    ```ts
    const values: ContentScopeValues<ContentScope> = [
        {
            domain: { label: "Main", value: "main" },
            language: { label: "English", value: "en" },
        },
        {
            domain: { label: "Main", value: "main" },
            language: { label: "German", value: "de" },
        },
        {
            domain: { label: "Secondary", value: "secondary" },
            language: { label: "English", value: "en" },
        },
    ];
    ```

2. The `config` prop of `ContentScopeControls` has been removed.
   You can use the props `searchable`, `groupBy`, and `icon` instead.
   You may also remove the convenience wrapper defined in the application as it doesn't offer a real benefit anymore:

    ```diff
    + import { ContentScopeControls } from "@comet/cms-admin";
    - import { ContentScopeControls as ContentScopeControlsLibrary } from "@comet/cms-admin";

    - export const ContentScopeControls: React.FC = () => {
    -     return <ContentScopeControlsLibrary<ContentScope> config={controlsConfig} />;
    - };
    ```
