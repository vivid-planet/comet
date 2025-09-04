import type { Permission } from "../user-permissions/user-permissions.types";

export interface ActionLogMetadata {
    requiredPermission: Array<Permission>;
}

export const ACTION_LOGS_METADATA_KEY = "actionLogs";

export function ActionLogs(metadata: ActionLogMetadata): ClassDecorator {
    return (entity) => {
        Reflect.defineMetadata(ACTION_LOGS_METADATA_KEY, metadata, entity.prototype);
    };
}
