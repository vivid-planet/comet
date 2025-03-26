import { type WarningSeverity } from "../entities/warning-severity.enum";

export interface CreateWarningInput {
    message: string;
    severity: `${WarningSeverity}`;
}
