import { registerEnumType } from "@nestjs/graphql";

export enum WarningState {
    open = "open",
    resolved = "resolved",
    ignored = "ignored",
}
registerEnumType(WarningState, {
    name: "WarningState",
});
