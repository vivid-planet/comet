import { registerEnumType } from "@nestjs/graphql";

export enum WarningStatus {
    open = "open",
    resolved = "resolved",
    ignored = "ignored",
}
registerEnumType(WarningStatus, {
    name: "WarningStatus",
});
