import { useQuery } from "@apollo/client";
import { Button, InlineAlert, Loading } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { Box } from "@mui/material";
import { type FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import { defaultFilterOutKeys, filterOutKeys } from "../actionLog.utils";
import { DiffHeader } from "../components/DiffHeader";
import { DiffViewer } from "../components/diffViewer/DiffViewer";
import { ActionLogHeader } from "../components/header/ActionLogHeader";
import { actionLogShowVersionQuery } from "./ActionLogShowVersion.gql";
import { type GQLActionLogShowVersionQuery, type GQLActionLogShowVersionQueryVariables } from "./ActionLogShowVersion.gql.generated";
import { LoadingContainer, PaperStyled, Root } from "./ActionLogShowVersion.styles";

type ActionLogShowVersionProps = {
    filterKeys?: string[];
    id: string;
    /**
     * latest name of the actual object which will be displayed in the title
     */
    name?: string;
    onClickShowVersionHistory: () => void;
    versionId: string;
};

export const ActionLogShowVersion: FunctionComponent<ActionLogShowVersionProps> = ({
    filterKeys: _filterKeys,
    id,
    name,
    onClickShowVersionHistory,
    versionId,
}) => {
    const filterKeys = _filterKeys != null ? [..._filterKeys, ...defaultFilterOutKeys] : defaultFilterOutKeys;

    const { data, error, loading } = useQuery<GQLActionLogShowVersionQuery, GQLActionLogShowVersionQueryVariables>(actionLogShowVersionQuery, {
        variables: {
            id: versionId,
        },
    });

    const version = data?.actionLog;
    const filteredVersionSnapshot = filterOutKeys(version?.snapshot, filterKeys);

    return (
        <Root>
            <Box marginBottom={4}>
                <Button onClick={onClickShowVersionHistory} startIcon={<ArrowLeft />} variant="primary">
                    <FormattedMessage defaultMessage="Show Version History" id="actionLog.actionLogCompare.showVersionHistory" />
                </Button>
            </Box>

            <ActionLogHeader
                dbTypes={version?.entityName ? [version?.entityName] : []}
                id={id}
                title={
                    <FormattedMessage
                        defaultMessage="Version {version} {name}"
                        id="actionLog.actionLogShow.title"
                        values={{
                            name: name != null ? `- ${name}` : "",
                            version: version?.version ?? (
                                <FormattedMessage defaultMessage="Unknown" id="actionLog.actionLogShowVersion.unknownVersion" />
                            ),
                        }}
                    />
                }
            />

            {loading && (
                <LoadingContainer>
                    <Loading behavior="auto" />
                </LoadingContainer>
            )}

            {error && <InlineAlert />}

            {version != null && (
                <PaperStyled>
                    <DiffViewer
                        leftTitle={<DiffHeader createdAt={version.createdAt} userId={version.userId} version={version.version} />}
                        newValue={JSON.stringify(filteredVersionSnapshot, null, 8)}
                        oldValue={JSON.stringify(filteredVersionSnapshot, null, 8)}
                        showDiffOnly={false}
                        splitView={false}
                    />
                </PaperStyled>
            )}
            {!loading && error == null && version == null && (
                <InlineAlert
                    title={<FormattedMessage id="actionLog.actionLogShowVersion.notFound.title" defaultMessage="Version not found" />}
                    description={
                        <FormattedMessage
                            id="actionLog.actionLogShowVersion.notFound.description"
                            defaultMessage="The requested version could not be found."
                        />
                    }
                />
            )}
        </Root>
    );
};
