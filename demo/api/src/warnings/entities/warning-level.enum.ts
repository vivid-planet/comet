import { registerEnumType } from "@nestjs/graphql";

export enum WarningLevel {
    critical = "critical",
    high = "high",
    low = "low",
}
registerEnumType(WarningLevel, {
    name: "WarningLevel",
});
