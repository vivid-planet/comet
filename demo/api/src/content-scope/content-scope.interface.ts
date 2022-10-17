// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { ContentScope } from "@comet/cms-api";

declare module "@comet/cms-api" {
    interface ContentScope {
        domain: "main" | "secondary";
        language: string;
    }
}
