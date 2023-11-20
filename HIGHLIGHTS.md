## Highlights

### Admin CRUD Generator

The Admin CRUD Generator was added.
It automatically generates an admin page, grid and form based on the GraphQL schema definition of an object type. It's meant to be used together with the existing API Generator.

More information in section @comet/cms-admin.

### Support for Relations in the API CRUD Generator

The API CRUD Generator now supports relations.

More information in section @comet/cms-api.

### DAM Scoping

The DAM now supports scoping.
Scoping can be enabled optionally. You can still use the DAM without scoping.

More information in sections @comet/cms-api and @comet/cms-admin.

### Cross-Scope & Cross-Environment Copying

When copying documents from one scope to another, the used DAM files are automatically imported into the target scope.
When copying documents from one environment to another (e.g. from production to your local dev environment), the used DAM files are imported to your environment via download.

More information in section @comet/cms-admin.

### Dependencies

The new `DependenciesService` provides methods to create and access an index containing all dependencies from blocks to entities.

Note: Currently, the library doesn't offer a way to display the dependencies in the admin. This will be added in a later minor release of v5.

More information in section @comet/cms-api.

### No "Discard unsaved Changes" Dialog in Tabs

Switching tabs in `RouterTabs` no longer triggers a "Discard unsaved changes" dialog.

More information in section @comet/admin.

### Multi-Select Form Field

`FinalFormSelect` now supports multi-select.

More information in section @comet/admin.

### DocumentInterface Implementation Helper

The new `createDocumentRootBlocksMethods()` helper function can be used to create some of the methods required by the `DocumentInterface` (useful for `Page` and other document types).

More information in section @comet/cms-admin.
