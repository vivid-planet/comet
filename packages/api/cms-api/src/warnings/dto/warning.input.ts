import { type WarningSeverity } from "./warning-severity.enum";

export interface WarningInput {
    message: string;
    severity: WarningSeverity;
}
