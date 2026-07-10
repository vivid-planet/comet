import { type CustomDecorator, SetMetadata } from "@nestjs/common";

export const DISABLE_ACCESS_LOG_METADATA_KEY = "disableAccessLog";

export const DisableAccessLog = (): CustomDecorator<string> => SetMetadata(DISABLE_ACCESS_LOG_METADATA_KEY, true);
