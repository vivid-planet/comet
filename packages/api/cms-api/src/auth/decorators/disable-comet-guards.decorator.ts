import { type CustomDecorator, SetMetadata } from "@nestjs/common";

export const DISABLE_COMET_GUARDS_METADATA_KEY = "disableCometGuards";

export const DisableCometGuards = (): CustomDecorator<string> => {
    return SetMetadata(DISABLE_COMET_GUARDS_METADATA_KEY, true);
};
