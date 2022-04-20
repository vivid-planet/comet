import { useBlockContext } from "@comet/admin-blocks";

import { CmsBlockContext } from "./CmsBlockContextProvider";

function useCmsBlockContext(): CmsBlockContext {
    return useBlockContext() as CmsBlockContext;
}

export { useCmsBlockContext };
