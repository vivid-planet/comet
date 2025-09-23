import { useQuery } from "@apollo/client";
import { Button, InlineAlert, Loading, useStoredState } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { Box, FormControlLabel, Switch, useMediaQuery, useTheme } from "@mui/material";
import { type FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import { defaultFilterOutKeys, filterOutKeys } from "../actionLog.utils";
import { DiffHeader } from "../components/DiffHeader";
import { DiffViewer } from "../components/diffViewer/DiffViewer";
import { ActionLogHeader } from "../components/header/ActionLogHeader";
import { actionLogCompareQuery } from "./ActionLogCompare.gql";
import { type GQLActionLogCompareQuery, type GQLActionLogCompareQueryVariables } from "./ActionLogCompare.gql.generated";
import { LoadingContainer, PaperStyled, Root } from "./ActionLogCompare.styles";

type ActionLogCompareProps = {
    filterKeys?: string[];
    id: string;
    /**
     * latest name of the actual object which will be displayed in the title
     */
    name?: string;
    onClickShowVersionHistory: () => void;
    versionId: string;
    versionId2: string;
};

export const ActionLogCompare: FunctionComponent<ActionLogCompareProps> = ({
    filterKeys: _filterKeys,
    id,
    name,
    onClickShowVersionHistory,
    versionId,
    versionId2,
}) => {
    const [onlyShowChanges, setOnlyShowChanges] = useStoredState<boolean>("actionLogCompare.onlyShowChanges", false);
    const filterKeys = _filterKeys != null ? [..._filterKeys, ...defaultFilterOutKeys] : defaultFilterOutKeys;

    const theme = useTheme();
    const smallBreakpoint = useMediaQuery(theme.breakpoints.down("md"));

    const { data, error, loading } = useQuery<GQLActionLogCompareQuery, GQLActionLogCompareQueryVariables>(actionLogCompareQuery, {
        variables: {
            versionId,
            versionId2,
        },
    });

    const afterVersion = data?.afterVersion;
    const beforeVersion = data?.beforeVersion;

    const filteredSnapshotBeforeVersion = filterOutKeys(beforeVersion?.snapshot, filterKeys);
    const filteredSnapshotAfterVersion = filterOutKeys(afterVersion?.snapshot, filterKeys);

    return (
        <Root>
            <Box marginBottom={4}>
                <Button onClick={onClickShowVersionHistory} startIcon={<ArrowLeft />} variant="primary">
                    <FormattedMessage defaultMessage="Show Version History" id="actionLog.actionLogCompare.showVersionHistory" />
                </Button>
            </Box>

            <ActionLogHeader
                action={
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyShowChanges}
                                onChange={(event, checked) => {
                                    setOnlyShowChanges(checked);
                                }}
                            />
                        }
                        label={<FormattedMessage defaultMessage="Show Changes Only" id="actionLog.actionLogCompare.onlyShowChanges.switchLabel" />}
                    />
                }
                dbTypes={Array.from(new Set([data?.beforeVersion.entityName ?? "", data?.afterVersion.entityName ?? ""]))}
                id={id}
                title={
                    <FormattedMessage
                        defaultMessage="Content Comparison {name}"
                        id="actionLog.actionLogCompare.title"
                        values={{
                            name: name != null ? `- ${name}` : "",
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

            {!loading && error == null && (afterVersion == null || beforeVersion == null) && (
                <Box margin={6}>
                    <InlineAlert
                        title={<FormattedMessage id="actionLog.actionLogCompare.notFound.title" defaultMessage="Versions not found" />}
                        description={
                            <FormattedMessage
                                id="actionLog.actionLogCompare.notFound.description"
                                defaultMessage="One or both of the requested versions could not be found."
                            />
                        }
                    />
                </Box>
            )}
            {afterVersion != null && beforeVersion != null && (
                <PaperStyled>
                    <DiffViewer
                        leftTitle={
                            smallBreakpoint ? (
                                <>
                                    <DiffHeader
                                        createdAt={beforeVersion?.createdAt}
                                        userId={beforeVersion?.userId}
                                        version={beforeVersion?.version}
                                    />

                                    <DiffHeader createdAt={afterVersion?.createdAt} userId={afterVersion?.userId} version={afterVersion?.version} />
                                </>
                            ) : (
                                <DiffHeader createdAt={beforeVersion?.createdAt} userId={beforeVersion?.userId} version={beforeVersion?.version} />
                            )
                        }
                        newValue={JSON.stringify(filteredSnapshotAfterVersion, null, 8)}
                        oldValue={JSON.stringify(filteredSnapshotBeforeVersion, null, 8)}
                        rightTitle={<DiffHeader createdAt={afterVersion?.createdAt} userId={afterVersion?.userId} version={afterVersion?.version} />}
                        showDiffOnly={onlyShowChanges}
                        splitView={!smallBreakpoint}
                    />
                </PaperStyled>
            )}
        </Root>
    );
};
