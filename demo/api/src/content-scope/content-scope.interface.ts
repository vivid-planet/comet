// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { ContentScope } from "@comet/cms-api";
import { ContentScope as BaseContentScope } from "@src/site-configs";

declare module "@comet/cms-api" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ContentScope extends BaseContentScope {}
}
