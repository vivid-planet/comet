import { CustomDecorator, SetMetadata } from "@nestjs/common";

export interface ScopedEntityMeta {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (entity: any) => Promise<Record<string, string>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ScopedEntity = (fn: (entity: any) => Promise<Record<string, string>>): CustomDecorator<string> => {
    return SetMetadata("scoped", { fn });
};
