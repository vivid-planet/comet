import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export interface ScopedEntityMeta {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (entity: any) => Promise<ContentScope>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ScopedEntity = (fn: (entity: any) => Promise<ContentScope>): CustomDecorator<string> => {
    return SetMetadata("scopedEntity", { fn });
};
