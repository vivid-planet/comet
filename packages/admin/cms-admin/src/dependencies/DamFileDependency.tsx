import { messages } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DependencyInterface } from "./types";

export const DamFileDependency: DependencyInterface = {
    displayName: <FormattedMessage {...messages.file} />,
};
