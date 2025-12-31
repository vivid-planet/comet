import { type BrevoPermission } from "./permissions/brevo-permission.enum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BrevoContactAttributesInterface = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BrevoContactFilterAttributesInterface = Record<string, Array<any> | undefined>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EmailCampaignScopeInterface = Record<string, any>;

declare module "@comet/cms-api" {
    export interface PermissionOverrides {
        app: BrevoPermission;
    }
}
