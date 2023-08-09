import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ScopedEntity = (entity: any) => Promise<ContentScope>;

export const ScopedEntity = (callback: ScopedEntity): CustomDecorator<string> => {
    return SetMetadata<string, ScopedEntity>("scopedEntity", callback);
};
