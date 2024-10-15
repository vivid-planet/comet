import { Stack, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { BlockInterface, createOneOfBlock } from "@comet/blocks-admin";
import { ComponentType } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ExternalLinkBlock } from "../blocks/ExternalLinkBlock";
import { InternalLinkBlock } from "../blocks/InternalLinkBlock";
import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { useContentScope } from "../contentScope/Provider";
import { RedirectForm } from "./RedirectForm";
import { RedirectsGrid } from "./RedirectsGrid";

interface CreateRedirectsPageOptions {
    customTargets?: Record<string, BlockInterface>;
    scopeParts?: string[];
}

function createRedirectsPage({ customTargets, scopeParts = [] }: CreateRedirectsPageOptions = {}): ComponentType {
    const linkBlock = createOneOfBlock({
        supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, ...customTargets },
        name: "RedirectsLink",
        displayName: <FormattedMessage id="comet.blocks.link" defaultMessage="Link" />,
        allowEmpty: false,
    });

    function Redirects(): JSX.Element {
        const intl = useIntl();

        const { scope: completeScope } = useContentScope();
        const scope = scopeParts.reduce((acc, scopePart) => {
            acc[scopePart] = completeScope[scopePart];
            return acc;
        }, {} as { [key: string]: unknown });

        return (
            <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.redirects", defaultMessage: "Redirects" })}>
                <StackSwitch initialPage="grid">
                    <StackPage name="grid">
                        <StackToolbar scopeIndicator={<ContentScopeIndicator scope={scope} />} />
                        <RedirectsGrid linkBlock={linkBlock} scope={scope} />
                    </StackPage>
                    <StackPage name="edit" title={intl.formatMessage({ id: "comet.pages.redirects.edit", defaultMessage: "edit" })}>
                        {(selectedId: string) => {
                            return <RedirectForm mode="edit" id={selectedId} linkBlock={linkBlock} scope={scope} />;
                        }}
                    </StackPage>
                    <StackPage name="add" title={intl.formatMessage({ id: "comet.pages.redirects.create", defaultMessage: "create" })}>
                        {() => {
                            return <RedirectForm mode="add" linkBlock={linkBlock} scope={scope} />;
                        }}
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    }

    return Redirects;
}

export { createRedirectsPage };
