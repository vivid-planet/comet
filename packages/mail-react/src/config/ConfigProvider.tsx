import { createContext, type PropsWithChildren, type ReactNode, useContext } from "react";

/**
 * Configuration context for mails.
 *
 * Add custom keys via TypeScript interface declaration merging:
 *
 * ```ts
 * declare module "@comet/mail-react" {
 *     interface Config {
 *         myKey?: { foo: string };
 *     }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Config {}

const ConfigContext = createContext<Config | null>(null);

/**
 * Places a `Config` value into a React context, making it available to all
 * descendants via `useConfig`.
 */
export function ConfigProvider({ config, children }: PropsWithChildren<{ config: Config }>): ReactNode {
    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

/**
 * Returns the nearest `Config` from context, defined by `ConfigProvider` or by the `config` prop on `MjmlMailRoot`.
 */
export function useConfig(): Config {
    return useContext(ConfigContext) ?? {};
}
