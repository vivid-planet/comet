import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
export enum KubernetesJobStatus {
    "pending" = "pending",
    "active" = "active",
    "succeeded" = "succeeded",
    "failed" = "failed",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(KubernetesJobStatus, { name: "KubernetesJobStatus" });
