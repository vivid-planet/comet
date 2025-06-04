import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { useContentScope } from "../../contentScope/Provider";

export function usePageTreeScope(): Record<string, unknown> {
    const { pageTreeScopeParts } = useCmsBlockContext();
    const { scope: completeScope } = useContentScope();

    if (pageTreeScopeParts) {
        const pageTreeScope = pageTreeScopeParts.reduce((pageTreeScope, dimension) => {
            if (completeScope[dimension] !== undefined) {
                pageTreeScope[dimension] = completeScope[dimension];
            }
            return pageTreeScope;
        }, {} as Record<string, unknown>);

        return pageTreeScope;
    }

    return completeScope;
}
