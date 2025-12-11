// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { ContentScope } from "@comet/cms-api";

export type BaseContentScope = {
    department: string;
};

declare module "@comet/cms-api" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}
}
