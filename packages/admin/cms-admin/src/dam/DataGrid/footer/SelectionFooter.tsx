import { Tooltip } from "@comet/admin";
import { Archive, Delete, Error as ErrorIcon, Move, Restore, ThreeDotSaving } from "@comet/admin-icons";
import { Divider, IconButton as CometAdminIconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { DamMoreActions } from "../selection/DamMoreActions";
import { useDamSelectionApi } from "../selection/DamSelectionContext";
import { DamFooter } from "./DamFooter";

const ButtonGroup = styled("div")`
    display: flex;
    gap: 10px;
`;

const StyledErrorIcon = styled(ErrorIcon)`
    color: ${({ theme }) => theme.palette.error.main};
`;

interface DamSelectionFooterProps {
    open: boolean;
}

export const DamSelectionFooter = ({ open }: DamSelectionFooterProps) => {
    const damSelectionActionsApi = useDamSelectionApi();

    if (!open) {
        return null;
    }

    return (
        <DamFooter open={open}>
            <Typography>
                <FormattedMessage
                    id="comet.dam.footer.selected"
                    defaultMessage="{count, plural, one {# item} other {# items}} selected"
                    values={{
                        count: damSelectionActionsApi.selectionMap.size,
                    }}
                />
            </Typography>
            <ButtonGroup sx={{ alignSelf: "stretch" }}>
                <FooterActionButton
                    title={<FormattedMessage id="comet.dam.footer.move" defaultMessage="Move" />}
                    onClick={() => {
                        damSelectionActionsApi.moveSelected();
                    }}
                    icon={<Move />}
                    loading={damSelectionActionsApi.moving}
                    hasErrors={damSelectionActionsApi.hasMoveErrors}
                />
                <FooterActionButton
                    title={<FormattedMessage id="comet.dam.footer.archive" defaultMessage="Archive" />}
                    onClick={() => {
                        damSelectionActionsApi.archiveSelected();
                    }}
                    icon={<Archive />}
                    loading={damSelectionActionsApi.archiving}
                    hasErrors={damSelectionActionsApi.hasArchiveErrors}
                />
                <FooterActionButton
                    title={<FormattedMessage id="comet.dam.footer.restore" defaultMessage="Restore" />}
                    onClick={() => {
                        damSelectionActionsApi.restoreSelected();
                    }}
                    icon={<Restore />}
                    loading={damSelectionActionsApi.restoring}
                    hasErrors={damSelectionActionsApi.hasRestoreErrors}
                />
                <FooterActionButton
                    title={<FormattedMessage id="comet.dam.footer.delete" defaultMessage="Delete" />}
                    onClick={() => {
                        damSelectionActionsApi.deleteSelected();
                    }}
                    icon={<Delete />}
                    loading={damSelectionActionsApi.deleting}
                    hasErrors={damSelectionActionsApi.hasDeletionErrors}
                />
                <Divider
                    orientation="vertical"
                    sx={(theme) => ({
                        borderColor: theme.palette.grey.A200,
                    })}
                    flexItem={true}
                />
                <DamMoreActions
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                />
            </ButtonGroup>
        </DamFooter>
    );
};

const StyledCometAdminIconButton = styled(CometAdminIconButton)`
    color: ${({ theme }) => theme.palette.grey.A100};
    padding-left: 4px;
    padding-right: 4px;
`;

interface IconButtonProps {
    title: NonNullable<ReactNode>;
    onClick?: () => void;
    icon: ReactNode;
    loading?: boolean;
    hasErrors?: boolean;
}

const FooterActionButton = ({ title, onClick, icon, loading, hasErrors }: IconButtonProps) => {
    return (
        <Tooltip title={title}>
            <StyledCometAdminIconButton onClick={onClick} size="large">
                {loading ? <ThreeDotSaving /> : hasErrors ? <StyledErrorIcon /> : icon}
            </StyledCometAdminIconButton>
        </Tooltip>
    );
};
