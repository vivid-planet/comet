import { useQuery } from "@apollo/client";
import { ActionLogHeader, Button, DiffHeader, DiffViewer, InlineAlert, Loading } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { Box } from "@mui/material";
import { type FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import { defaultFilterOutKeys, filterOutKeys } from "../actionLog.utils";
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
            filter: {
                and: [
                    {
                        entityId: {
                            equal: id,
                        },
                        or: [
                            {
                                id: {
                                    equal: versionId,
                                },
                            },
                        ],
                    },
                ],
            },
            limit: 2,
            offset: 0,
        },
    });

    const version = data?.actionLogs.nodes.find((node) => {
        return node.id === versionId;
    });

    const filteredVersionSnapshot = filterOutKeys(version?.snapshot, filterKeys);

    return (
        <Root>
            <Box marginBottom={4}>
                <Button onClick={onClickShowVersionHistory} startIcon={<ArrowLeft />} variant="primary">
                    <FormattedMessage defaultMessage="Show Version History" id="actionLog.actionLogCompare.showVersionHistory" />
                </Button>
            </Box>

            <ActionLogHeader
                dbTypes={Array.from(
                    new Set(
                        data?.actionLogs.nodes.map((value) => {
                            return value.entityName;
                        }),
                    ),
                )}
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
