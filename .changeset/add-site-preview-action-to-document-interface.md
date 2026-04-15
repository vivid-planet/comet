---
"@comet/cms-admin": minor
---

Add `SitePreviewAction` to `DocumentInterface`

Allows overriding the site preview button in the page tree row actions on a per-document-type basis. When set, the provided component replaces the default preview `RowActionsItem`, enabling custom preview URL construction (e.g., using additional GraphQL queries or scope data).

**Example**

```tsx
import { RowActionsItem } from "@comet/admin";
import { Preview } from "@comet/admin-icons";
import { type DocumentInterface, openSitePreviewWindow, type SitePreviewActionProps } from "@comet/cms-admin";

function PageSitePreviewAction({ page }: SitePreviewActionProps) {
    // Use hooks to construct a custom preview URL
    const previewPath = useCustomPreviewPath(page);

    return (
        <RowActionsItem
            icon={<Preview />}
            disabled={!previewPath}
            onClick={() => {
                if (previewPath) {
                    openSitePreviewWindow(previewPath, "/custom-root");
                }
            }}
        >
            Open preview
        </RowActionsItem>
    );
}

export const Page: DocumentInterface = {
    // ...
    SitePreviewAction: PageSitePreviewAction,
};
```
