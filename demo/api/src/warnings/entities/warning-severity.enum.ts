import { registerEnumType } from "@nestjs/graphql";

export enum WarningSeverity {
    critical = "critical",
    high = "high",
    low = "low",
}
registerEnumType(WarningSeverity, {
    name: "WarningSeverity",
});
