import { useCometConfig } from "../config/CometConfigContext";
import { useContentScope } from "../contentScope/Provider";

export interface RedirectsConfig {
    scopeParts?: string[];
}

function useRedirectsConfig(): RedirectsConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.redirects) {
        throw new Error("No redirects configuration found. Make sure to set `redirects` in `CometConfigProvider`.");
    }

    return cometConfig.redirects;
}

export function useRedirectsScope(): { [key: string]: unknown } {
    const { scopeParts } = useRedirectsConfig();
    const { scope: completeScope } = useContentScope();

    const redirectScope = scopeParts?.length
        ? scopeParts.reduce(
              (acc, scopePart) => {
                  acc[scopePart] = completeScope[scopePart];
                  return acc;
              },
              {} as { [key: string]: unknown },
          )
        : completeScope;

    return redirectScope;
}
