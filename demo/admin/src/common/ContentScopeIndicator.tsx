import { messages } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { ContentScopeInterface, LegacyContentScopeIndicator as ContentScopeIndicatorLibrary } from "@comet/cms-admin";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

type Props = React.ComponentProps<typeof ContentScopeIndicatorLibrary> & { scope?: ContentScopeInterface; domainOnly?: boolean };

function ContentScopeIndicator({ variant, global, scope, domainOnly }: Props): JSX.Element {
    if (global) {
        return (
            <ContentScopeIndicatorLibrary global variant={variant}>
                <Domain fontSize="small" />
                <DomainLabel variant="body2">
                    <FormattedMessage {...messages.globalContentScope} />
                </DomainLabel>
            </ContentScopeIndicatorLibrary>
        );
    }

    if (!scope) {
        throw new Error("Missing scope object for non-global content scope indicator");
    }

    return (
        <ContentScopeIndicatorLibrary variant={variant} global={global}>
            <Domain fontSize="small" />
            <DomainLabel variant="body2">{scope.domain}</DomainLabel>
            {!domainOnly && (
                <>
                    {` | `}
                    <LanguageLabel variant="body2">{scope.language}</LanguageLabel>
                </>
            )}
        </ContentScopeIndicatorLibrary>
    );
}

const DomainLabel = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

const LanguageLabel = styled(Typography)`
    && {
        padding-left: 8px;
        text-transform: uppercase;
    }
`;

export { ContentScopeIndicator };
