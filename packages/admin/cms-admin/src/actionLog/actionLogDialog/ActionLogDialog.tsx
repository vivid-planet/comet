import { Dialog } from "@comet/admin";
import { type FunctionComponent, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ActionLogCompare } from "../actionLogCompare/ActionLogCompare";
import { ActionLogGrid } from "../actionLogGrid/ActionLogGrid";
import { ActionLogShowVersion } from "../actionLogShowVersion/ActionLogShowVersion";

type ActionLogCompareState = {
    type: "compareVersions";
    versionId: string;
    versionId2: string;
};

type ActionLogGridState = {
    type: "grid";
};

type ActionLogShowState = {
    type: "showVersion";
    versionId: string;
};

type ActionLogState = ActionLogCompareState | ActionLogGridState | ActionLogShowState;

type ActionLogDialogProps = {
    entityName: string;
    id: string;
    /**
     * latest name of the actual object which will be displayed in the title
     */
    name?: string;
    onClose: () => void;
    open: boolean;
};
export const ActionLogDialog: FunctionComponent<ActionLogDialogProps> = ({ id, entityName, name, onClose, open }) => {
    const [state, setState] = useState<ActionLogState>({ type: "grid" });

    useEffect(
        function resetStateOnReopen() {
            if (open) {
                setState({ type: "grid" });
            }
        },
        [open],
    );
    const intl = useIntl();

    return (
        <Dialog
            fullWidth={true}
            maxWidth={state.type === "compareVersions" ? "xl" : "md"}
            onClose={onClose}
            open={open}
            title={intl.formatMessage({
                defaultMessage: "Action Log",
                id: "actionLog.actionLogModal.title",
            })}
        >
            {state.type === "grid" && (
                <ActionLogGrid
                    entityName={entityName}
                    id={id}
                    name={name}
                    onClick={(versionId) => {
                        setState({
                            type: "showVersion",
                            versionId: versionId,
                        });
                    }}
                    onCompareVersionsClick={(versionId, versionsId2) => {
                        setState({
                            type: "compareVersions",
                            versionId: versionId,
                            versionId2: versionsId2,
                        });
                    }}
                />
            )}

            {state.type === "compareVersions" && (
                <ActionLogCompare
                    id={id}
                    name={name}
                    onClickShowVersionHistory={() => {
                        setState({ type: "grid" });
                    }}
                    versionId={state.versionId}
                    versionId2={state.versionId2}
                />
            )}

            {state.type === "showVersion" && (
                <ActionLogShowVersion
                    id={id}
                    name={name}
                    onClickShowVersionHistory={() => {
                        setState({ type: "grid" });
                    }}
                    versionId={state.versionId}
                />
            )}
        </Dialog>
    );
};
