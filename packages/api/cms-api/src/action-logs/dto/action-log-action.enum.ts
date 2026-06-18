import { registerEnumType } from "@nestjs/graphql";

export enum ActionLogAction {
    Created = "Created",
    Updated = "Updated",
    Deleted = "Deleted",
}

registerEnumType(ActionLogAction, {
    name: "ActionLogAction",
});
