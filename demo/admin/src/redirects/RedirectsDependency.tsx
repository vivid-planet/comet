import { createDependencyMethods, type DependencyInterface } from "@comet/cms-admin";
import { RedirectLinkBlock } from "@src/common/MasterMenu";
import { FormattedMessage } from "react-intl";

export const RedirectDependency: DependencyInterface = {
    displayName: <FormattedMessage id="redirect.displayName" defaultMessage="Redirect" />,
    ...createDependencyMethods({
        rootQueryName: "redirect",
        rootBlocks: {
            target: {
                block: RedirectLinkBlock,
            },
        },
        basePath: ({ id }) => `/system/redirects/${id}/edit`,
    }),
};
