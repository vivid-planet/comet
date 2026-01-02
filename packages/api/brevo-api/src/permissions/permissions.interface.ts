import type { BrevoPermission } from "./brevo-permission.enum";

declare module "@comet/cms-api" {
    export interface PermissionOverrides {
        app: BrevoPermission;
    }
}
