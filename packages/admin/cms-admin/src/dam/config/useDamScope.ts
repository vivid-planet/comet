import { useContentScope } from "../../contentScope/Provider";
import { useDamConfig } from "./useDamConfig";

function useDamScope(): Record<string, unknown> {
    const { scopeParts = [] } = useDamConfig();
    const { scope: completeScope } = useContentScope();

    return scopeParts.reduce((damScope, scope) => {
        damScope[scope] = completeScope[scope];
        return damScope;
    }, {} as { [key: string]: unknown });
}

export { useDamScope };
