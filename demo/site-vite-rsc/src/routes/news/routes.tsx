import type { PredefinedPageRoute } from "../predefinedPagesRoutes";
import { NewsDetailPage } from "./[slug]/NewsDetailPage";
import { NewsIndexPage } from "./NewsIndexPage";

export const routes: PredefinedPageRoute[] = [
    {
        pattern: "/",
        component: NewsIndexPage,
    },
    {
        pattern: "/:slug",
        component: NewsDetailPage,
    },
];
