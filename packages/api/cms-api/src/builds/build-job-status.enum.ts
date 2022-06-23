import { registerEnumType } from "@nestjs/graphql";

export enum BuildJobStatus {
    "pending" = "pending",
    "active" = "active",
    "succeeded" = "succeeded",
    "failed" = "failed",
}

registerEnumType(BuildJobStatus, { name: "BuildJobStatus" });
