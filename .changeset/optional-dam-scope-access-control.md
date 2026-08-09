---
"@comet/cms-api": minor
---

Make the DAM's scope-based access control optional

The DAM controllers required an `AccessControlService`, so `DamFilesModule` couldn't be registered without `UserPermissionsModule`. The service is now optional, and the endpoints fail closed with `403 Forbidden` when it is missing.

Pass `disableScopeAccessControl` to run the DAM behind your own authentication guard, without any scope checks:

```ts
DamFilesModule.register({
    damConfig,
    Scope: DamScope,
    File: DamFile,
    Folder: DamFolder,
    disableScopeAccessControl: true,
});
```

The option is only available on `DamFilesModule`, not on `DamModule`, which always runs with `UserPermissionsModule`.

Applications using `DamModule` together with `UserPermissionsModule` are unaffected: the endpoints keep using the registered `AccessControlService`.
