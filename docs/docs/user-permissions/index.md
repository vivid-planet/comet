---
title: User Permissions
sidebar_position: 6
---

While COMET DXP does not provide authentication it handles authorization by providing a User Permissions system.

## Key concepts

The user permissions system

-   streamlines authorization throughout the application
-   not only checks operations but also the handled data
-   relies on external user handling
-   allows assigning permissions by code as well as in the administration panel
-   offers an administration panel that works out of the box

COMET DXP checks authentication in two dimensions:

**Permissions** are used for access control to specific resolvers or controllers.

**Content Scopes** (also referred to as scopes) are used to control which data is allowed to be handled (see [documentation about content scopes](/docs/content-scope)).

Users in COMET DXP possess permissions and scopes. Every operation is assigned to one or more permissions and handles data that is bound to a scope. The system then just tries to match if the requested permissions and scopes are covered by the user's permissions and scopes.

There are no roles as they can easily be represented as a combination of permissions. Furthermore, the ability to check scopes is much more powerful than just having assigned a role.

## Important types

-   `User` is provided by COMET DXP as an interface so that it's possible to enhance the type by Typescript augmentation. By default, a ` User` object contains the fields `id`, `name` and `email`.
-   `CurrentUser` is used as a GraphQL-type and is returned by GetCurrentUser(). It's not customizable and enhances the default `User` type with the current permissions and scopes.
-   `ContentScope` is provided as an interface and should be augmented in the application.
-   There is no custom type for permissions, they are reflected as plain strings.
