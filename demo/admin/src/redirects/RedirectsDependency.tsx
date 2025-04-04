import { createDependencyMethods, type DependencyInterface } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { FormattedMessage } from "react-intl";

export const RedirectDependency: DependencyInterface = {
    displayName: <FormattedMessage id="redirect.displayName" defaultMessage="Redirect" />,
    ...createDependencyMethods({
        rootQueryName: "redirect",
        rootBlocks: {
            target: {
                block: LinkBlock,
            },
        },
        basePath: ({ id }) => `/system/redirects/${id}/edit`,
    }),
};
