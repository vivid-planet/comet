---
title: Enable Action Log for an Entity
---

This guide walks you through enabling the [Action Log](/docs/features-modules/action-log/) for an existing entity – both on the API side (recording changes) and on the admin side (showing the version history to editors).

The example uses a `Product` entity, but the steps are the same for any entity.

## Prerequisites

- An entity that you want to track (e.g. created by the API Generator).
- An admin edit page for that entity (e.g. created by the Admin Generator).

## 1. Enable the module globally

If your application has not enabled the Action Log yet, register `ActionLogsModule.forRoot()` once in your `AppModule`. This installs the database subscriber that writes log entries.

```ts title="api/src/app.module.ts"
import { ActionLogsModule } from "@comet/cms-api";

@Module({
    imports: [
        // ...
        ActionLogsModule.forRoot(),
    ],
})
export class AppModule {}
```

Run your project's migrations afterwards so the `ActionLog` table is created:

```sh
npm --prefix api run mikro-orm migration:up
```

## 2. Mark the entity with `@ActionLogs()`

Add the decorator to every entity that should be tracked. Without it, no log entries are created for that entity.

```ts title="api/src/products/entities/product.entity.ts"
import { ActionLogs } from "@comet/cms-api";

@Entity()
@ObjectType()
@ActionLogs()
export class Product extends BaseEntity {
    // ...
}
```

## 3. Expose the GraphQL fields

Register `ActionLogsModule.forFeature([...])` in the entity's NestJS module. This adds the `actionLog(id)` and `actionLogs(offset, limit, sort)` fields to the entity's GraphQL type.

```ts title="api/src/products/products.module.ts"
import { ActionLogsModule } from "@comet/cms-api";

@Module({
    imports: [
        MikroOrmModule.forFeature([Product /* ... */]),
        ActionLogsModule.forFeature([Product]),
    ],
})
export class ProductsModule {}
```

Restart the API. The GraphQL schema now contains the new fields. You can verify with a quick query in the GraphQL Playground:

```graphql
query {
    product(id: "…") {
        actionLogs(offset: 0, limit: 10, sort: [{ field: version, direction: DESC }]) {
            totalCount
            nodes {
                id
                version
                userId
                createdAt
            }
        }
    }
}
```

## 4. Attribute changes made in console commands

The user id stored on each log entry is read from `UserPermissionsStorageService`. For HTTP and GraphQL requests this is populated automatically. Console commands have no request context, so wrap the command runner with `runWith` to set a user (typically a system user):

```ts title="api/src/console.ts"
import { UserPermissionsStorageService } from "@comet/cms-api";

await app.get(UserPermissionsStorageService).runWith({ user: SYSTEM_USER_NAME }, async () => {
    await CommandFactory.runApplication(app);
});
```

Without this, writes made from commands fail because the storage is not initialized.

## 5. Add a "Version history" button to the edit page

Import `ActionLogDialog` from `@comet/cms-admin` and open it from a button on the entity's edit page. The dialog handles the grid, single-version view and compare view internally.

```tsx title="admin/src/products/EditProduct.tsx"
import { ActionLogDialog } from "@comet/cms-admin";
import { Button } from "@comet/admin";
import { History } from "@comet/admin-icons";
import { useState } from "react";

import type { GQLQuery } from "../graphql.generated";

type Props = {
    id: string;
    name?: string;
};

export function EditProduct({ id, name }: Props) {
    const [historyOpen, setHistoryOpen] = useState(false);

    return (
        <>
            <Button startIcon={<History />} onClick={() => setHistoryOpen(true)}>
                Version history
            </Button>

            <ActionLogDialog<GQLQuery>
                id={id}
                rootField="product"
                name={name}
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
            />
        </>
    );
}
```

A few notes:

- `rootField` is the **GraphQL** root query field that returns this entity (e.g. `product`, `manufacturer`), **not** the entity's class name.
- Passing the application's `GQLQuery` type as a generic constrains `rootField` to entities that actually expose `actionLog`/`actionLogs`, so a typo is caught at compile time.
- `name` is optional but improves the dialog's title (e.g. `Version history – Awesome Sneaker`).

## 6. Try it

1. Open the edit page of any tracked entity in the admin.
2. Change a field and save – this creates version 1.
3. Save again with another change – this creates version 2.
4. Click **Version history**.
5. In the grid, click the _eye_ icon to view a version's full snapshot.
6. Tick the checkboxes of two rows and click **Compare** to open the side-by-side diff. Toggle **Show changes only** to hide unchanged lines.

## Customising

Need a custom layout instead of the all-in-one dialog? Use the building blocks individually:

```tsx
import { ActionLogGrid, ActionLogCompare, ActionLogShowVersion } from "@comet/cms-admin";
```

These components accept the queried data as props, so you can build any combination of grid, version view and compare view on your own page – with your own GraphQL queries, filters or routing.
