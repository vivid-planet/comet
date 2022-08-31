import { registerEnumType } from "@nestjs/graphql";

export enum JobStatus {
    "pending" = "pending",
    "active" = "active",
    "succeeded" = "succeeded",
    "failed" = "failed",
}

registerEnumType(JobStatus, { name: "JobStatus" });
