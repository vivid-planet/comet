import { type AppPermission } from "@src/auth/app-permission.enum";

declare module "@comet/cms-api" {
    export interface PermissionOverrides {
        app: AppPermission;
    }
}
