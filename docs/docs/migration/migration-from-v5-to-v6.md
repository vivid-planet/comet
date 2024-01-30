---
title: Migrating from v5 to v6
sidebar_position: 1
---

# Migrating from v5 to v6

First, execute `npx @comet/upgrade v6` in the root of your project. 
It automatically installs the new versions of all `@comet` libraries and handles some of the necessary renames.

## API

### User Permissions

1. _Prerequisites_: Manage or sync allowed users in project (not covered here)

2. Remove custom `CurrentUser` and `CurrentUserLoader`

    ```diff
    - declare module "@comet/cms-api" {
    -     interface CurrentUserInterface {
    -         ...
    -     }
    - }

    - @ObjectType()
    - export class CurrentUser implements CurrentUserInterface {
    -     ...
    - }

    - export class CurrentUserLoader implements CurrentUserLoaderInterface {
    -     ...
    - }
    ```

    Also remove usage

    ```diff
      createAuthProxyJwtStrategy({
          jwksUri: config.auth.idpJwksUri,
    -     currentUserLoader: new CurrentUserLoader(),
      }),
    ```

    Change imports of removed classes

    ```diff
    - import { CurrentUser, CurrentUserLoader } from "@src/auth/current-user";
    + import { CurrentUser } from "@comet/cms-api";
    ```

    It shouldn't be necessary to override these classes anymore. However, if you really need it, provide the CurrentUserLoader with `CURRENT_USER_LOADER`.

3. Create interface for `availablePermissions` similar to the already existing interface `interface ContentScope`

    ```ts
    declare module "@comet/cms-api" {
        interface Permission {
            // e.g. `products: string;`
        }
    }
    export {};
    ```

4. Create necessary services for the `UserPermissionsModule` (either in a new module or where it fits best)

    ```ts
    // Attention: might already being provided by the library which syncs the users
    @Injectable()
    export class UserService implements UserPermissionsUserServiceInterface {
        getUser(id: string): User {
            ...
        }
        findUsers(args: FindUsersArgs): Users {
            ...
        }
    }
    ```

    ```ts
    @Injectable()
    export class AccessControlService extends AbstractAccessControlService {
        getPermissionsForUser(user: User): PermissionsForUser {
            // e.g. return `UserPermissions.allPermissions;` for certain users
        }
        getContentScopesForUser(user: User): ContentScopesForUser {
            // e.g. return `UserPermissions.allContentScopes;` for certain users
        }
    }
    ```

5. Replace `ContentScopeModule` with `UserPermissionsModule`

   Remove `ContentScopeModule`:

    ```diff
    - ContentScopeModule.forRoot({
    -     ...
    - }),
    ```

   Add `UserPermissionsModule`:

    ```ts
    UserPermissionsModule.forRootAsync({
        useFactory: (userService: UserService, accessControlService: AccessControlService) => ({
            availablePermissions: [/* Array of strings defined in interface Permission */],
            availableContentScopes: [/* Array of content Scopes */],
            userService,
            accessControlService,
        }),
        inject: [UserService, AccessControlService],
        imports: [/* Modules which provide the services injected in useFactory */],
    }),
    ```

6. Rename and add decorators

    Rename `@SubjectEntity` to `@AffectedEntity` (this is done by `@comet/upgrade`)

    ```diff
    - @SubjectEntity(...)
    + @AffectedEntity(...)
    ```

    Add `@RequiredPermission` to resolvers and controllers

    ```diff
    + @RequiredPermission(["pageTree"])
      export class PagesResolver {
    ```

    Remove `@AllowForRole` (replaced by `@RequiredPermission`)

    ```diff
    - @AllowForRole(...)
    ```

### JobStatus

The `JobStatus` enum was renamed to `KubernetesJobStatus`. The rename is done by `@comet/upgrade`.

## Admin

### User Permissions

1. Add `<CurrentUserProvider>` to App.tsx

    ```diff
    <ApolloProvider client={apolloClient}>
    +    <CurrentUserProvider>
    ```

2. Use `useCurrentUser()` hook instead requesting the current user from the API

    ```diff
    - const { loading, data } = useQuery(gql`
    -     query CurrentUser {
    -         currentUser {
    -             ...
    -         }
    -     }
    - `);
    + const user = useCurrentUser();
    ```

    Also access allowedContentScopes where necessary (e.g. in ContentScopeProvider):

    ```diff
    - const allowedUserDomains = data.currentUser.domains;
    + const allowedUserDomains = user.allowedContentScopes.map((contentScope) => contentScope.domain);
    ```

3. Add the `UserPermissionsPage`

    ```tsx
    <MenuItemRouterLink
        primary={intl.formatMessage({ id: "menu.userPermissions", defaultMessage: "User Permissions" })}
        icon={<Snips />}
        to={`${match.url}/user-permissions`}
    />
    ```

    ```tsx
    <RouteWithErrorBoundary path={`${match.path}/user-permissions`} component={UserPermissionsPage} />
    ```

### Sites Config

The `SitesConfigProvider` and `useSitesConfig` were made generic.

You must make following changes in the application:

1.  Define the type of your sites config

    Preferably this should be done in `config.ts`:

    ```diff
    export function createConfig() {
        // ...

        return {
            ...cometConfig,
            apiUrl: environmentVariables.API_URL,
            adminUrl: environmentVariables.ADMIN_URL,
    +       sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG) as SitesConfig,
        };
    }

    + export type SitesConfig = Record<string, SiteConfig>;
    ```

2.  Use the type when using `useSitesConfig`

    ```diff
    - const sitesConfig = useSitesConfig();
    + const sitesConfig = useSitesConfig<SitesConfig>();
    ```

3.  Optional: Remove type annotation from `ContentScopeProvider#resolveSiteConfigForScope` (as it's now inferred)

    ```diff
    - resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
    + resolveSiteConfigForScope: (configs, scope: ContentScope) => configs[scope.domain],
    ```

### BuildRuntime

The `BuildRuntime` component was renamed to `JobRuntime`. The rename is done by `@comet/upgrade`.

### @comet/admin

#### FinalForm

Previously, `FinalForm#onAfterSubmit()` automatically executed

```ts
stackApi?.goBack();
editDialog?.closeDialog({ delay: true });
```

This was removed because it was often unwanted and overridden.

**You need to:**

1. Add following code if you still want the old behavior:

    ```tsx
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);

    // ...

    <FinalForm
        onAfterSubmit={() => {
            stackApi?.goBack();
            editDialog?.closeDialog({ delay: true });
        }}
    >
    ```

2. You can remove workarounds like

    ```diff
    - onAfterSubmit={() => {
    -     //don't go back automatically
    - }}
    ```

### @comet/admin-icons

The icons `Betrieb`, `LogischeFilter`, `Pool`, `Pool2`, `Vignette1`, `Vignette2`, `StateGreen`, `StateGreenRing`, `StateOrange`, `StateOrangeRing`, `StateRed` and `StateRedRing` were removed.

If you used any of these icons in your app, you must add them to your project. You can download them [here](https://github.com/vivid-planet/comet/tree/76e50aa86fd69b1df79825967c6c5c50e2cb6df7/packages/admin/admin-icons/icons/deprecated).

## ESLint

**Both new rules are auto-fixable.** All errors can be fixed by executing `npm run lint:eslint -- --fix` in `/api`, `/admin` and `/site`.

### @comet/no-other-module-relative-import

The `@comet/no-other-module-relative-import` rule is now enabled by default. It enforces absolute imports when importing from other modules.

```diff
- import { AThingInModuleA } from "../moduleA/AThingInModuleA"
+ import { AThingInModuleA } from "@src/moduleA/AThingInModuleA"
```

### import/newline-after-import

The `import/newline-after-import` rule is now enabled by default. It enforces adding a blank line between imports and code.
