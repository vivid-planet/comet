import { registerEnumType } from "@nestjs/graphql";

export enum SendingState {
    DRAFT = "DRAFT",
    SENT = "SENT",
    SCHEDULED = "SCHEDULED",
}

registerEnumType(SendingState, {
    name: "SendingState",
});
