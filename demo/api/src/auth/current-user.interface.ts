// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { CurrentUser } from "@comet/cms-api";

declare module "@comet/cms-api" {
    interface CurrentUser {
        contentScopes?: Array<Record<string, string>>;
    }
    /*
    contentScrops: [
        {
            domain: "at",
        }
    ]
    */
}
