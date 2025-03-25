import { type WarningSeverity } from "../entities/warning-severity.enum";

export interface WarningInput {
    message: string;
    severity: `${WarningSeverity}`;
}
