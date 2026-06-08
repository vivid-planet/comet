---
"@comet/cms-api": minor
---

Add `findUser` and `findUserOrThrow` to `UserPermissionsUserServiceInterface`

The `getUser` method on `UserPermissionsUserServiceInterface` is now deprecated in favor of two new methods:

- `findUser(id): Promise<User | null>` — returns `null` when the user does not exist
- `findUserOrThrow(id): Promise<User>` — throws when the user does not exist

This lets consumers opt into a non-throwing path without wrapping `getUser` calls in `try`/`catch`. Existing implementations that only define `getUser` continue to work; the service falls back to it.

**Example**

```ts
export class UserService implements UserPermissionsUserServiceInterface {
    async findUser(id: string): Promise<User | null> {
        return this.users.find((user) => user.id === id) ?? null;
    }

    async findUserOrThrow(id: string): Promise<User> {
        const user = await this.findUser(id);
        if (!user) {
            throw new Error(`User not found: ${id}`);
        }
        return user;
    }

    // ...
}
```
