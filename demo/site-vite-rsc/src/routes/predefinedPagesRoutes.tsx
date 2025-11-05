import type { PublicSiteConfig } from "@src/site-configs";
import type { ComponentType } from "react";

import { routes as newsRoutes } from "./news/routes";

export type PredefinedPageRoute = {
    pattern: string;
    component: ComponentType<{
        scope: {
            domain: string;
            language: string;
        };
        siteConfig: PublicSiteConfig;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: any;
    }>;
};
export const predefinedPagesRoutes: Record<string, PredefinedPageRoute[]> = {
    news: newsRoutes,
};
