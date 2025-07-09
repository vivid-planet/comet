import { type ProjectPermission } from "@src/common/enum/project-permission.enum";

declare module "@comet/cms-api" {
    export interface PermissionOverrides {
        project: ProjectPermission;
    }
}
