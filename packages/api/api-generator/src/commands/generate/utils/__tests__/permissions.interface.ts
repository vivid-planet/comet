import "@comet/cms-api";

declare module "@comet/cms-api" {
    export interface PermissionOverrides {
        test: "crud";
    }
}
