---
"@comet/cms-admin": major
---

Remove `EditPageLayout`

You can completely remove `EditPageLayout` from your application.
Instead, use `MainContent` to wrap all your page content except the `Toolbar`.
If needed, wrap `MainContent` and `Toolbar` in a fragment.

Example:

```diff
- <EditPageLayout>
+ <>
      <Toolbar>
          // ...
      </Toolbar>
-     <div>
+     <MainContent>
          // ...
-     </div>
+     </MainContent>
- </EditPageLayout>
+ </>
```
