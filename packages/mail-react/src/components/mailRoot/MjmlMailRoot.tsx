import { Mjml, MjmlAll, MjmlAttributes, MjmlBody, MjmlHead } from "@faire/mjml-react";
import type { PropsWithChildren, ReactNode } from "react";

/**
 * The root element for email templates. Renders the standard MJML email skeleton
 * (`<Mjml>`, `<MjmlHead>`, `<MjmlBody>`) with `<MjmlAll padding={0} />` as the
 * default attribute so all components start with zero padding.
 *
 * Direct children should be section-level components (e.g. `MjmlSection`).
 */
export function MjmlMailRoot({ children }: PropsWithChildren): ReactNode {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlAll padding="0" />
                </MjmlAttributes>
            </MjmlHead>
            <MjmlBody>{children}</MjmlBody>
        </Mjml>
    );
}
