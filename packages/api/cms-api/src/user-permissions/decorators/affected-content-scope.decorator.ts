import { SetMetadata } from "@nestjs/common";

export type AffectedContentScope = {
    argsSelector: string;
};

export const AffectedContentScope = (options: AffectedContentScope) => {
    return SetMetadata<string, AffectedContentScope>("affectedContentScope", options);
};
