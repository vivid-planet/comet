import { registerEnumType } from "@nestjs/graphql";

export enum ActionLogType {
    Created = "Created",
    Updated = "Updated",
    Deleted = "Deleted",
}

registerEnumType(ActionLogType, {
    name: "ActionLogType",
});
