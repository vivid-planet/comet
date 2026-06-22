import { Button, InlineAlert, Loading } from "@comet/admin";
import { ArrowLeft, Restore } from "@comet/admin-icons";
import { Box } from "@mui/material";
import type { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import { defaultFilterOutKeys, filterOutKeys } from "../actionLogCompare/ActionLogCompare.utils";
import { ActionLogHeader } from "../actionLogHeader/ActionLogHeader";
import { DiffHeader } from "../diffHeader/DiffHeader";
import { DiffViewer } from "../diffViewer/DiffViewer";
import type { GQLActionLogShowVersionFragment } from "./ActionLogShowVersion.gql.generated";
import { DiffViewerContainer, LoadingContainer, Root } from "./ActionLogShowVersion.styles";

type ActionLogShowVersionProps = {
    actionLog: GQLActionLogShowVersionFragment | undefined;
    error?: boolean;
    filterKeys?: string[];
    id: string;
    loading: boolean;
    /**
     * Latest name of the actual object, displayed in the title
     */
    name?: string;
    onClickShowVersionHistory: () => void;
    /**
     * Called when the user wants to restore the entity to this version's snapshot.
     * The restore action is only available for versions that have a snapshot (not for deletions).
     */
    onRestore?: () => void;
    restoring?: boolean;
};

export const ActionLogShowVersion: FunctionComponent<ActionLogShowVersionProps> = ({
    actionLog: version,
    error,
    filterKeys: passedFilterKeys,
    id,
    loading,
    name,
    onClickShowVersionHistory,
    onRestore,
    restoring,
}) => {
    const filterKeys = passedFilterKeys != null ? [...passedFilterKeys, ...defaultFilterOutKeys] : defaultFilterOutKeys;

    const filteredVersionSnapshot = filterOutKeys(version?.snapshot, filterKeys);

    const versionLabel = version?.version ?? <FormattedMessage defaultMessage="Unknown" id="actionLog.actionLogShowVersion.unknownVersion" />;

    const title =
        name != null ? (
            <FormattedMessage
                defaultMessage="Version {version} – {name}"
                id="actionLog.actionLogShowVersion.titleWithName"
                values={{ name, version: versionLabel }}
            />
        ) : (
            <FormattedMessage defaultMessage="Version {version}" id="actionLog.actionLogShowVersion.title" values={{ version: versionLabel }} />
        );

    return (
        <Root>
            <Box display="flex" gap={2} justifyContent="space-between" marginBottom={4}>
                <Button onClick={onClickShowVersionHistory} startIcon={<ArrowLeft />} variant="textDark">
                    <FormattedMessage defaultMessage="Show Version History" id="actionLog.actionLogCompare.showVersionHistory" />
                </Button>
                {onRestore != null && version?.snapshot != null && (
                    <Button disabled={restoring} onClick={onRestore} startIcon={<Restore />} variant="primary">
                        <FormattedMessage defaultMessage="Restore this version" id="actionLog.actionLogShowVersion.restore" />
                    </Button>
                )}
            </Box>

            <ActionLogHeader dbTypes={version?.entityName ? [version.entityName] : []} id={id} title={title} />

            {loading && (
                <LoadingContainer>
                    <Loading behavior="auto" />
                </LoadingContainer>
            )}

            {error && <InlineAlert />}

            {version != null && (
                <DiffViewerContainer>
                    <DiffViewer
                        leftTitle={
                            <DiffHeader
                                createdAt={version.createdAt}
                                userId={version.user.id}
                                userName={version.user.name ?? undefined}
                                version={version.version}
                            />
                        }
                        newValue={JSON.stringify(filteredVersionSnapshot, null, 8)}
                        oldValue={JSON.stringify(filteredVersionSnapshot, null, 8)}
                        showDiffOnly={false}
                        splitView={false}
                    />
                </DiffViewerContainer>
            )}
            {!loading && !error && version == null && (
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

export { actionLogShowVersionFragment } from "./ActionLogShowVersion.gql";
