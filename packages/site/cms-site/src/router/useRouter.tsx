// eslint-disable-next-line no-restricted-imports
import { NextRouter, useRouter as useNextRouter } from "next/router";

import { usePreview } from "../preview/usePreview";

export function useRouter(): NextRouter {
    const { previewPathToPath, pathToPreviewPath } = usePreview();
    const router = useNextRouter();

    return {
        ...router,
        pathname: previewPathToPath(router.pathname),
        asPath: previewPathToPath(router.asPath),
        route: previewPathToPath(router.route),
        push: (url, as, options) => router.push(pathToPreviewPath(url), as, options),
        replace: (url, as, options) => router.replace(pathToPreviewPath(url), as, options),
    };
}
