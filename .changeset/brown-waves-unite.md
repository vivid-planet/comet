---
"@comet/admin": minor
---

Add `FullHeightContent` component

Used to help components take advantage of all the available content height, e.g., when using a `DataGrid` inside `Tabs` already contained in a `MainContent` component.

Usage example for `FullHeightContent`:

```tsx
<MainContent>
    <RouterTabs>
        <RouterTab label="DataGrid Example" path="">
            <FullHeightContent>
                <DataGrid />
            </FullHeightContent>
        </RouterTab>
        <RouterTab label="Another tab" path="/another-tab">
            Content of another tab
        </RouterTab>
    </RouterTabs>
</MainContent>
```

Example where `MainContent` with `fullHeight` should be used, instead of `FullHeightContent`:

```tsx
<MainContent fullHeight>
    <DataGrid />
</MainContent>
```
