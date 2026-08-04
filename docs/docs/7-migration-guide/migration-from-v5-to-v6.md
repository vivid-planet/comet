---
title: Migrating from v5 to v6
sidebar_position: -6
---

# Migrating from v5 to v6

First, execute `npx @comet/upgrade@latest v6` in the root of your project.
It automatically installs the new versions of all `@comet` libraries, runs an ESLint autofix and handles some of the necessary renames.

<details>

<summary>Renames handled by @comet/upgrade</summary>

- `JobStatus` -> `KubernetesJobStatus` in API
- `@SubjectEntity` -> `@AffectedEntity` in API
- `BuildRuntime` -> `JobRuntime` in Admin

</details>

## API

### User Permissions

1.  _Prerequisites_: Manage or sync allowed users in project (not covered here)

2.  Remove custom `CurrentUser` and `CurrentUserLoader`

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

    Furthermore, it's not necessary anymore to provide the CurrentUser

    ```diff
      createAuthResolver({
    -      currentUser: CurrentUser,
    ```

    Change imports of removed classes

    ```diff
    - import { CurrentUser, CurrentUserLoader } from "@src/auth/current-user";
    + import { CurrentUser } from "@comet/cms-api";
    ```

    Replace occurrences of CurrentUserInterface

    ```diff
    - @GetCurrentUser() user: CurrentUserInterface;
    + @GetCurrentUser() user: CurrentUser;
    ```

    It is not possible anymore to use a custom CurrentUserLoader neither to augment/use the CurrentUserInterface.

3.  Create the `AccessControlService` for the `UserPermissionsModule` (either in a new module or where it fits best)

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

4.  Replace `ContentScopeModule` with `UserPermissionsModule`

    Remove `ContentScopeModule`:

    ```diff
    - ContentScopeModule.forRoot({
    -     ...
    - }),
    ```

    Add `UserPermissionsModule`:

    ```ts
    UserPermissionsModule.forRootAsync({
        useFactory: (accessControlService: AccessControlService) => ({
            availableContentScopes: [/* Array of content Scopes */],
            accessControlService,
        }),
        inject: [AccessControlService],
        imports: [/* Modules which provide the services injected in useFactory */],
    }),
    ```

5.  Adapt decorators

    Add `@RequiredPermission` to resolvers and controllers

    ```diff
    + @RequiredPermission(["pageTree"])
      export class PagesResolver {
    ```

    Remove `@AllowForRole` (replaced by `@RequiredPermission`)

    ```diff
    - @AllowForRole(...)
    ```

6.  Annotate document entities with `@ScopedEntity()`

    Document entities (e.g. `Page`, `Link`, `PredefinedPage`) don't have their own scope.
    Instead, they get their scope from the `PageTreeNode` they are attached to.
    For the scope check to work, you must add the following decorator to the entity:

    ```diff
      @Entity()
      @ObjectType({
         implements: () => [DocumentInterface],
      })
    + @ScopedEntity(PageTreeNodeDocumentEntityScopeService)
      export class Page extends BaseEntity<Page, "id"> implements DocumentInterface {
    ```

7.  Make sure the scope check can be performed for all operations

    All queries and mutations must
    - have a `scope` argument, _or_
    - be annotated with an `@AffectedEntity()` decorator, _or_
    - skip the scope check using `@RequiredPermission("examplePermission", { skipScopeCheck: true })`

8.  Optional: Add the `UserService` (required for Administration Panel, see Admin)

    Create a `UserService`:

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

    Add it to the `UserPermissionsModule`:

    ```diff
      UserPermissionsModule.forRootAsync({
    +     useFactory: (accessControlService: AccessControlService, userService: UserService) => ({
    -     useFactory: (accessControlService: AccessControlService) => ({
              availableContentScopes: [/* Array of content Scopes */],
    +         userService,
              accessControlService,
          }),
    +     inject: [AccessControlService, UserService],
    -     inject: [AccessControlService],
          imports: [/* Modules which provide the services injected in useFactory */],
      }),
    ```

### Block Index

Automate the creation of the block index during local development:

1. Call `DependenciesService#createViews` in your `FixturesConsole`:

```diff
  // ...
  await this.publicUploadsFixtureService.generatePublicUploads();

+ await this.dependenciesService.createViews();

  await this.orm.em.flush();
  // ...
```

2. Call `createBlockIndexViews` before starting the API (after the migrations):

Remove `db:migrate` from `dev-pm.config.js`:

```diff
{
   name: "api",
-  script: "npm --prefix api run db:migrate && npm --prefix api run start:dev",
+  script: "npm --prefix api run start:dev",
   group: "api",
   waitOn: ["tcp:$POSTGRESQL_PORT", "tcp:$IMGPROXY_PORT"],
},
```

Add `db:migrate` and `createBlockIndexViews` to `start:dev` script in package.json:

```diff
- "start:dev": "npm run prebuild && dotenv -c secrets -- nest start --watch --preserveWatchOutput",
+ "start:dev": "npm run prebuild && npm run db:migrate && npm run console createBlockIndexViews && dotenv -c secrets -- nest start --watch --preserveWatchOutput",
```

## Admin

### User Permissions

1. Add `<CurrentUserProvider>` beneath `<MuiThemeProvider>` and move `<ErrorDialogHandler>` so that it becomes a sibling of `<CurrentUserProvider>` in App.tsx

    ```diff
    <MuiThemeProvider theme={theme}>
    +    <ErrorDialogHandler />
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

3. Optional: Add the Administration Panel

    ```tsx
    <MenuItemRouterLink
        primary={intl.formatMessage({
            id: "menu.userPermissions",
            defaultMessage: "User Permissions",
        })}
        icon={<Snips />}
        to={`${match.url}/user-permissions`}
    />
    ```

    ```tsx
    <RouteWithErrorBoundary
        path={`${match.path}/user-permissions`}
        component={UserPermissionsPage}
    />
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
