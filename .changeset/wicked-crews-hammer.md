---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add possibility to add application-defined configurations for permissions

1. Define in API: Add type to Permission-Interface:

```diff
declare module "@comet/cms-api" {
    interface Permission {
-        news: string
+        news: {
+           commentsEdit: boolean;
+        };
```

2. Define in Admin: Add FinalForm-fields as configurationSlot

```diff
+ const NewsPermissionConfiguration = () => (
+     <Field
+         name="commentsEdit"
+         component={FinalFormCheckbox}
+         type="checkbox"
+         label={<FormattedMessage id="userPermissions.newsComent" defaultMessage="Allow editing News-Comments" />}
+     />
+ );
- export const UserPermissionsPage: React.FC = () => <UserPermissions />;
+ export const UserPermissionsPage: React.FC = () => <UserPermissions configurationSlots={{ news: NewsPermissionConfiguration }} />;
```

3. Require in API:

```diff
- @RequiredPermission([{ permission: "news" }])
+ @RequiredPermission([{ permission: "news", configuration: { commentsEdit: true } }])
export class NewsCommentResolver {
```
