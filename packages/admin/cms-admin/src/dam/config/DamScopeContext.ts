import * as React from "react";

/**
 * Content to explicitly provide a DAM scope when the scope can't be derived from the URL (e.g., when using a MemoryRouter).
 */
export const DamScopeContext = React.createContext<Record<string, unknown> | undefined>(undefined);
