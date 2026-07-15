---
"@comet/cms-api": minor
---

Add `findUser` / `findUserOrThrow` (and `findUserForLogin` / `findUserForLoginOrThrow`) to `UserPermissionsUserServiceInterface`

The throwing `getUser` and `getUserForLogin` methods on `UserPermissionsUserServiceInterface` are now deprecated in favor of paired find methods:

- `findUser(id): Promise<User | null>` / `findUserOrThrow(id): Promise<User>`
- `findUserForLogin(id): Promise<User | null>` / `findUserForLoginOrThrow(id): Promise<User>`

This lets consumers opt into a non-throwing path without wrapping lookups in `try`/`catch`. Existing implementations that only define `getUser` / `getUserForLogin` continue to work; the service falls back to them.

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
