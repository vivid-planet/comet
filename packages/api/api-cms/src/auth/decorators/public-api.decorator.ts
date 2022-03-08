import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const PublicApi = (): CustomDecorator<string> => {
    return SetMetadata("publicApi", true);
};
