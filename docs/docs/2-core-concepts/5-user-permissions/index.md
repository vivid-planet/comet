---
title: User Permissions
sidebar_position: 5
---

While COMET DXP does not provide authentication, it handles authorization by providing a User Permissions system.

## Key concepts

The user permissions system

- streamlines authorization throughout the application
- not only checks operations but also the handled data
- relies on external user handling
- allows assigning permissions by code as well as in the admin panel
- offers an admin panel that works out of the box

COMET DXP checks authentication in two dimensions:

**Permissions** are used for access control to specific resolvers or controllers.

**Content Scopes** (also referred to as scopes) are used to control which data is allowed to be handled (see [documentation about content scopes](/docs/core-concepts/content-scope)).

Users in COMET DXP possess permissions and scopes. Every operation is assigned to one or more permissions and handles data that is bound to a scope. The system then tries to match if the requested permissions and scopes are covered by the user's permissions and scopes.

There are no roles as they can easily be represented as a combination of permissions. Furthermore, the ability to check scopes is more powerful than just being assigned a single role.

## Permission Sources

Permissions can be assigned to users in two ways:

**Permission By Rule (Programmatic)**: Permissions assigned through code in the `AccessControlService.getPermissionsForUser()` method. These are automatically applied based on user attributes and are perfect for role-based access control.

**Manual Permissions**: Permissions assigned through the admin panel's User Permissions interface. These can be granted or revoked per user, can include time-based restrictions, and include audit information.

When checking permissions, the system considers both sources - a user's final permissions are the union of both programmatic and manual permissions.

For more details, see the [Implementation Guide](/docs/core-concepts/user-permissions/implementation-guide).

## Important types

- `User` is provided by COMET DXP as an interface so that it's possible to enhance the type by TypeScript module augmentation. By default, a ` User` object contains the fields `id`, `name` and `email`.
- `CurrentUser` is used as a GraphQL-type and is returned by `@GetCurrentUser`. It's not customizable and enhances the default `User` type with the current permissions and scopes.
- `ContentScope` is provided as an interface and should be augmented in the application.
- There is no custom type for permissions, they are reflected as plain strings.
