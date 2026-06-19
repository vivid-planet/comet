---
title: Copying across scopes
---

# Copying content across scopes

When content is copied from one [scope](../content-scope) to another — for example by copying a page in the page tree or by pasting a block into a different scope — the content often references other entities, most notably DAM files.
These referenced entities might not exist in the target scope.
Copying a page that uses an image into another scope would otherwise result in a dangling reference, because the image only exists in the source scope.

To prevent this, COMET copies the referenced entities to the target scope and rewrites the references in the copied content to point to the copies.

This builds on the [block dependencies](./index.md): each block declares which entities it references through its `dependencies` method, and rewrites those references through its `replaceDependenciesInOutput` method.

## How it works

A scope-crossing copy resolves a set of _dependency replacements_ and applies them to the copied content:

1. The dependencies of the copied content are collected (via the block/document `dependencies` method).
2. Each dependency is handled by a `ScopeCopyHandler` for its entity type. The handler copies the entity to the target scope (or reuses an existing copy) and returns how the reference should be rewritten.
3. The replacements are applied to the copied content with `replaceDependenciesInOutput`.

A `ScopeCopyHandler` for a given dependency type (matched by its `targetGraphqlObjectType`, e.g. `"DamFile"`) returns a `ReplaceDependencyObject` per dependency. The return value encodes the outcome:

| Outcome                                          | `ReplaceDependencyObject`             |
| ------------------------------------------------ | ------------------------------------- |
| Point to a copy in the target scope              | `{ replaceWithId: <new id> }`         |
| Reuse an entity that already exists in the scope | `{ replaceWithId: <existing id> }`    |
| Keep the reference (e.g. an unscoped entity)     | _omit the dependency from the result_ |
| Clear the reference                              | `{ replaceWithId: undefined }`        |
| Abort the whole copy                             | `throw`                               |

Dependency types **without** a registered handler are cleared (fail-secure), so a copy never keeps a dangling reference to a scoped entity from the source scope.

The DAM file handler is built in.
It reuses an existing copy in the target DAM scope when one exists, otherwise copies the files into a DAM inbox folder in the target scope.
When the DAM is unscoped (global), references are kept as-is.

## Registering a handler for your own entity

Register handlers for your project's entity types via the `ScopeCopyHandlersProvider`.
A project handler overrides a built-in handler with the same `dependencyType`.

```tsx
// App.tsx
import { ScopeCopyHandlersProvider } from "@comet/cms-admin";

<ScopeCopyHandlersProvider handlers={[productScopeCopyHandler]}>
    {/* ... */}
</ScopeCopyHandlersProvider>;
```

```tsx
// productScopeCopyHandler.ts
import { ScopeCopyHandler } from "@comet/cms-admin";

export const productScopeCopyHandler: ScopeCopyHandler<{ product: GQLProduct }> = {
    dependencyType: "Product",
    copyToScope: async (dependencies, { client, targetScope }) => {
        const replacements = [];
        for (const { id } of dependencies) {
            const { data } = await client.mutate({
                mutation: copyProductToScopeMutation,
                variables: { id, scope: targetScope },
            });
            replacements.push({
                type: "Product",
                originalId: id,
                replaceWithId: data.copyProductToScope.id,
            });
        }
        return replacements;
    },
};
```

:::note

The `sourceScope` and `targetScope` passed to a handler are _content_ scopes.
An entity type may use its own scope concept derived from the content scope (the DAM scope, for example).
Mapping the content scope to the entity's own scope is the handler's responsibility — typically by reading the entity-specific scope context (e.g. `useDamScope`) when the handler is created.

:::

### Unscoped entities

Some entities are not scoped (global / shared across all scopes).
Their references stay valid in any scope, so they must be kept rather than copied or cleared.
Use `createUnscopedScopeCopyHandler` to register such a type:

```tsx
import { createUnscopedScopeCopyHandler } from "@comet/cms-admin";

<ScopeCopyHandlersProvider handlers={[createUnscopedScopeCopyHandler("Setting")]}>
    {/* ... */}
</ScopeCopyHandlersProvider>;
```
