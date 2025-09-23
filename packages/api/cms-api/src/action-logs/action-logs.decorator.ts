import type { Permission } from "../user-permissions/user-permissions.types";

interface ActionLogOptions {
    requiredPermission: Permission | Array<Permission>;
}

export interface ActionLogMetadata {
    requiredPermission: Array<Permission>;
}

export const ACTION_LOGS_METADATA_KEY = "actionLogs";

export function ActionLogs({ requiredPermission }: ActionLogOptions): ClassDecorator {
    return (entity) => {
        Reflect.defineMetadata(
            ACTION_LOGS_METADATA_KEY,
            {
                requiredPermission: Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission],
            } satisfies ActionLogMetadata,
            entity.prototype,
        );
    };
}
