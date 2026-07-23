import { type Config, MjmlMailRoot } from "@comet/mail-react";
import type { PropsWithChildren } from "react";

import { theme } from "../theme";

export function WelcomeEmailRoot({ config, children }: PropsWithChildren<{ config: Config }>) {
    return (
        <MjmlMailRoot theme={theme} config={config}>
            {children}
        </MjmlMailRoot>
    );
}
