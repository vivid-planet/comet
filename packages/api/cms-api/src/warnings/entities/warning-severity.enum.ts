import { registerEnumType } from "@nestjs/graphql";

export enum WarningSeverity {
    high = "high",
    medium = "medium",
    low = "low",
}
registerEnumType(WarningSeverity, {
    name: "WarningSeverity",
});
