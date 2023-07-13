import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { ContentScope } from "../common/decorators/content-scope.interface";
import { PermissionConfiguration } from "./user-permissions.types";

interface CurrentUserInterface {
    permissions: CurrentUserPermission[];
    contentScopes: CurrentUserContentScope[];
    isAllowed(permission: UserPermission, contentScope: ContentScope): boolean;
}

@ObjectType()
export class CurrentUserPermission {
    @Field()
    name: string;
    @Field(() => GraphQLJSONObject, { nullable: true })
    configuration?: PermissionConfiguration;
    @Field()
    overrideContentScopes: boolean;
    @Field(() => [CurrentUserContentScope])
    contentScopes: CurrentUserContentScope[];
}

@ObjectType()
export class CurrentUserContentScope {
    @Field()
    scope: string;
    @Field()
    label: string;
    @Field(() => [CurrentUserContentScopeValue])
    values: CurrentUserContentScopeValue[];
}

@ObjectType()
export class CurrentUserContentScopeValue {
    @Field()
    label: string;
    @Field()
    value: string;
}

type UserPermission =
    | {
          permission: string;
          configuration?: PermissionConfiguration;
      }
    | string;

function checkPermissionConfiguration(c1?: PermissionConfiguration, c2?: PermissionConfiguration): boolean {
    if (!c1) return true;
    if (!c2) return false;
    for (const key of Object.keys(c1)) {
        if (c1[key] !== c2[key]) return false;
    }
    return true;
}

function checkContentScope(contentScopes: CurrentUserContentScope[], contentScope?: ContentScope) {
    if (!contentScope) return true;
    return Object.keys(contentScope).every((scope) =>
        contentScopes.find((cs) => cs.scope === scope)?.values.some((v) => v.value === contentScope[scope as keyof ContentScope]),
    );
}

@ObjectType()
export class CurrentUser implements CurrentUserInterface {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    language: string;
    @Field(() => [CurrentUserContentScope])
    contentScopes: CurrentUserContentScope[];
    @Field(() => [CurrentUserPermission])
    permissions: CurrentUserPermission[];

    isAllowed(permission: UserPermission, contentScope?: ContentScope): boolean {
        if (typeof permission === "string")
            return this.permissions.some(
                (p) => p.name === permission && checkContentScope(p.overrideContentScopes ? p.contentScopes : this.contentScopes, contentScope),
            );
        return this.permissions.some(
            (p) =>
                p.name === permission.permission &&
                checkPermissionConfiguration(permission.configuration, p.configuration) &&
                checkContentScope(p.overrideContentScopes ? p.contentScopes : this.contentScopes, contentScope),
        );
    }
}
