import { useBlockContext } from "@comet/blocks-admin";

import { CmsBlockContext } from "./CmsBlockContextProvider";

function useCmsBlockContext(): CmsBlockContext {
    return useBlockContext() as CmsBlockContext;
}

export { useCmsBlockContext };
