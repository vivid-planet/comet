import { RedirectBase } from "./entities/redirect-base.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RedirectScopeInterface = Record<string, any>; //@TODO: move to general scope (other modules (pageTree, dam) need this too)
export type RedirectInterface = RedirectBase & { scope?: RedirectScopeInterface };
