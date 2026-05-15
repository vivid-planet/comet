import { Dialog, InlineAlert, type useDataGridRemote, type usePersistentColumnState } from "@comet/admin";
import type { FunctionComponent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ActionLogCompare } from "../actionLogCompare/ActionLogCompare";
import type { GQLActionLogCompareFragmentFragment } from "../actionLogCompare/ActionLogCompare.gql.generated";
import { ActionLogGrid } from "../actionLogGrid/ActionLogGrid";
import type { GQLActionLogGridFragmentFragment } from "../actionLogGrid/ActionLogGrid.gql.generated";
import { ActionLogShowVersion } from "../actionLogShowVersion/ActionLogShowVersion";
import type { GQLActionLogShowVersionFragmentFragment } from "../actionLogShowVersion/ActionLogShowVersion.gql.generated";

export type ActionLogDialogValue =
    | (ReturnType<typeof useDataGridRemote> &
          ReturnType<typeof usePersistentColumnState> & {
              type: "grid";
              actionLogs: { nodes: GQLActionLogGridFragmentFragment[]; totalCount: number } | undefined;
              error?: boolean;
              loading: boolean;
          })
    | {
          type: "showVersion";
          actionLog: GQLActionLogShowVersionFragmentFragment | undefined;
          error?: boolean;
          loading: boolean;
      }
    | {
          type: "compareVersions";
          afterVersion: GQLActionLogCompareFragmentFragment | undefined;
          beforeVersion: GQLActionLogCompareFragmentFragment | undefined;
          error?: boolean;
          loading: boolean;
      };

type ActionLogDialogProps = {
    id: string;
    name?: string;
    onClose: () => void;
    onCompareVersionsClick: (versionId: string, versionId2: string) => void;
    onShowVersionClick: (versionId: string) => void;
    onShowVersionHistoryClick: () => void;
    open: boolean;
    value: ActionLogDialogValue;
};

export const ActionLogDialog: FunctionComponent<ActionLogDialogProps> = ({
    id,
    name,
    onClose,
    onCompareVersionsClick,
    onShowVersionClick,
    onShowVersionHistoryClick,
    open,
    value,
}) => {
    const intl = useIntl();

    return (
        <Dialog
            fullWidth={true}
            maxWidth={value.type === "compareVersions" ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                defaultMessage: "Action Log",
                id: "actionLog.actionLogModal.title",
            })}
        >
            {value.type === "grid" && !value.error && (
                <ActionLogGrid
                    {...value}
                    id={id}
                    name={name}
                    onCompareVersionsClick={onCompareVersionsClick}
                    onShowVersionClick={onShowVersionClick}
                />
            )}

            {value.type === "grid" && value.error && (
                <InlineAlert title={<FormattedMessage defaultMessage="Error loading action logs" id="actionLog.actionLogDialog.gridError.title" />} />
            )}

            {value.type === "showVersion" && (
                <ActionLogShowVersion
                    actionLog={value.actionLog}
                    error={value.error}
                    id={id}
                    loading={value.loading}
                    name={name}
                    onClickShowVersionHistory={onShowVersionHistoryClick}
                />
            )}

            {value.type === "compareVersions" && (
                <ActionLogCompare
                    afterVersion={value.afterVersion}
                    beforeVersion={value.beforeVersion}
                    error={value.error}
                    id={id}
                    loading={value.loading}
                    name={name}
                    onClickShowVersionHistory={onShowVersionHistoryClick}
                />
            )}
        </Dialog>
    );
};
