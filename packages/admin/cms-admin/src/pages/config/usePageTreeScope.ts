import { CmsBlockContext } from "../../blocks/CmsBlockContextProvider";
import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { useContentScope } from "../../contentScope/Provider";

export function usePageTreeScope(): Record<string, unknown> {
    const context = useCmsBlockContext() as CmsBlockContext | undefined;
    const { scope: completeScope } = useContentScope();

    if (context?.pageTreeScopeParts) {
        const pageTreeScope = context.pageTreeScopeParts.reduce((pageTreeScope, dimension) => {
            if (completeScope[dimension] !== undefined) {
                pageTreeScope[dimension] = completeScope[dimension];
            }
            return pageTreeScope;
        }, {} as Record<string, unknown>);

        return pageTreeScope;
    }

    return completeScope;
}
