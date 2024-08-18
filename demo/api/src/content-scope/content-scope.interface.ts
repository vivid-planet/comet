// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { ContentScope } from "@comet/cms-api";
import { SHARED_DAM_SCOPE } from "@comet/cms-api/lib/dam/files/entities/folder.constants";

declare module "@comet/cms-api" {
    interface ContentScope {
        domain: "main" | "secondary" | typeof SHARED_DAM_SCOPE;
        language: string;
    }
}
