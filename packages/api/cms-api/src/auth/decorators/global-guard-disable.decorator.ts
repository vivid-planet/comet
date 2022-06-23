import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const DisableGlobalGuard = (): CustomDecorator<string> => {
    return SetMetadata("disableGlobalGuard", true);
};
