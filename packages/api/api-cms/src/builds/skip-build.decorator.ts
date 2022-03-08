import { SetMetadata } from "@nestjs/common";

export const SKIP_BUILD_METADATA_KEY = "skipBuild";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SkipBuild = (): any => SetMetadata(SKIP_BUILD_METADATA_KEY, true);
