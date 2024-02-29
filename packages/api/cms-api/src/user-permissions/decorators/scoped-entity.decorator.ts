import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export interface ScopedEntityMeta {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (entity: any) => Promise<ContentScope | ContentScope[]> | ContentScope | ContentScope[];
}

export const ScopedEntity = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (entity: any) => Promise<ContentScope | ContentScope[]> | ContentScope | ContentScope[],
): CustomDecorator<string> => {
    return SetMetadata("scopedEntity", { fn });
};
