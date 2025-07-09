import { registerEnumType } from "@nestjs/graphql";

export enum CometPermission {
    builds = "builds",
    dam = "dam",
    pageTree = "pageTree",
    cronJobs = "cronJobs",
    translation = "translation",
    userPermissions = "userPermissions",
    prelogin = "prelogin",
    impersonation = "impersonation",
    fileUploads = "fileUploads",
    dependencies = "dependencies",
    warnings = "warnings",
}
registerEnumType(CometPermission, {
    name: "CometPermission",
});
