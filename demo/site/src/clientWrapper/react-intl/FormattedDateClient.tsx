"use client";

// TODO: introduce restrict import eslint rule that restricts imports from react-intl package directly
import { ComponentProps, FunctionComponent } from "react";
import { FormattedDate as ReactIntlFormattedDate } from "react-intl";

type FormattedDateProps = ComponentProps<typeof ReactIntlFormattedDate>;

/**
 * `FormattedDate` from `react-intl` required client side only rendering, because it needs access to `IntlProvider`
 *
 * `FormattedDate` component that wraps `react-intl` `FormattedDate` to limit client side rendering to only this component
 */
export const FormattedDate: FunctionComponent<FormattedDateProps> = (props) => {
    return <ReactIntlFormattedDate {...props} />;
};
