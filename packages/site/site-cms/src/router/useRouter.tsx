import { NextRouter, useRouter as useNextRouter } from "next/router";

import { usePreview } from "../preview/usePreview";

export function useRouter(): NextRouter {
    const { previewPathToPath } = usePreview();
    const router = useNextRouter();

    return {
        ...router,
        pathname: previewPathToPath(router.pathname),
        asPath: previewPathToPath(router.asPath),
        route: previewPathToPath(router.route),
    };
}
