"use client";

// TODO: introduce restrict import eslint rule that restricts imports from react-intl package directly

import { ComponentProps, FunctionComponent } from "react";
import { FormattedMessage as ReactIntlFormattedMessage } from "react-intl";

type FormattedMessageProps = ComponentProps<typeof ReactIntlFormattedMessage>;

/**
 * `FormattedMessage` from `react-intl` required client side only rendering, because it needs access to `IntlProvider`
 *
 * `FormattedMessage` component that wraps `react-intl` `FormattedMessage` to limit client side rendering to only this component
 */
export const FormattedMessage: FunctionComponent<FormattedMessageProps> = (props) => {
    return <ReactIntlFormattedMessage {...props} />;
};
