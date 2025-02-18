import { type CmsBlockContext } from "./CmsBlockContextProvider";
import { useBlockContext } from "./context/useBlockContext";

function useCmsBlockContext(): CmsBlockContext {
    return useBlockContext() as CmsBlockContext;
}

export { useCmsBlockContext };
