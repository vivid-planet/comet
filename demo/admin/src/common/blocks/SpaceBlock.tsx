import { createSpaceBlock } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const options: { value: string; label: React.ReactNode }[] = [
    { value: "d150", label: <FormattedMessage id="spacing.d150" defaultMessage="Dynamic 150" /> },
    { value: "d200", label: <FormattedMessage id="spacing.d200" defaultMessage="Dynamic 200" /> },
    { value: "d250", label: <FormattedMessage id="spacing.d250" defaultMessage="Dynamic 250" /> },
    { value: "d300", label: <FormattedMessage id="spacing.d300" defaultMessage="Dynamic 300" /> },
    { value: "d350", label: <FormattedMessage id="spacing.d350" defaultMessage="Dynamic 350" /> },
    { value: "d400", label: <FormattedMessage id="spacing.d400" defaultMessage="Dynamic 400" /> },
    { value: "d450", label: <FormattedMessage id="spacing.d450" defaultMessage="Dynamic 450" /> },
    { value: "d500", label: <FormattedMessage id="spacing.d500" defaultMessage="Dynamic 500" /> },
    { value: "d550", label: <FormattedMessage id="spacing.d550" defaultMessage="Dynamic 550" /> },
    { value: "d600", label: <FormattedMessage id="spacing.d600" defaultMessage="Dynamic 600" /> },
];

export const SpaceBlock = createSpaceBlock<string>({ defaultValue: options[0].value, options });
