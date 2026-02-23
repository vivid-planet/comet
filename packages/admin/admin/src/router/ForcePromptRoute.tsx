import { type PropsWithChildren, useContext, useEffect } from "react";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { PromptContext } from "./Prompt";

interface ForcePromptRouteProps {
    path: string;
}

export function ForcePromptRoute({ path, children }: PropsWithChildren<ForcePromptRouteProps>) {
    const id = useConstant<string>(() => uuid());
    const context = useContext(PromptContext);
    useEffect(() => {
        if (context) {
            context.register(id, path);
        }
        return function cleanup() {
            if (context) {
                context.unregister(id);
            }
        };
    });
    return <>{children}</>;
}
