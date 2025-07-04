/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GQLCometPermission, GQLProjectPermission } from "@src/graphql.generated";
import type { ContentScope as BaseContentScope } from "@src/site-configs";

declare module "*.svg" {
    const content: any;
    export = content;
}

declare module "*.png" {
    const content: any;
    export = content;
}

declare module "*.jpg" {
    const content: any;
    export = content;
}

import "@comet/cms-admin";

declare module "@comet/cms-admin" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}

    export type Permission = GQLCometPermission | GQLProjectPermission | string;
}
