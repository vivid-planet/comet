export const GROUPED_ACTION_LOGS_METADATA_KEY = "groupedActionLogs";

export type GroupedActionLogsMetadata = string[];

/**
 * Marks a one-to-many or many-to-many relation as grouped, meaning changes to its items are logged as part of the
 * owning entity's action log instead of producing separate action log entries.
 *
 * Use this for relations that are edited through the owning entity's form (e.g. assigned colors or tags). It is often
 * combined with `orphanRemoval: true`, but that is not required.
 */
export function GroupedActionLogs(): PropertyDecorator {
    return (target, propertyKey) => {
        const existingRelations: GroupedActionLogsMetadata = Reflect.getOwnMetadata(GROUPED_ACTION_LOGS_METADATA_KEY, target) ?? [];
        Reflect.defineMetadata(GROUPED_ACTION_LOGS_METADATA_KEY, [...existingRelations, propertyKey.toString()], target);
    };
}
