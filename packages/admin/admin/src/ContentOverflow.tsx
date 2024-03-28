// TODO: Implement themability after theming-refactor is merged (https://github.com/vivid-planet/comet/pull/1376)

import { Close, Maximize } from "@comet/admin-icons";
import { ButtonBase, Dialog, DialogContent as MuiDialogContent, DialogTitle as MuiDialogTitle, IconButton, Paper } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export type ContentOverflowProps = React.PropsWithChildren<{
    dialogTitle?: React.ReactNode;
    iconMapping?: {
        openDialog?: React.ReactNode;
        closeDialog?: React.ReactNode;
    };
}>;

const Root = styled("div")(
    ({ theme }) => css`
        padding: ${theme.spacing(2)};
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    `,
);

const ClickableContent = styled(ButtonBase)(
    ({ theme }) => css`
        position: relative;
        width: 100%;
        height: 100%;
        padding: ${theme.spacing(2, 2, 0, 2)};
        box-sizing: border-box;
        border: 1px dashed ${theme.palette.grey[100]};
        border-radius: 3px;
        background-color: white;
        white-space: normal;
    `,
);

const ContentContainer = styled("div")(css`
    width: 100%;
    height: 100%;
    text-align: left;
    overflow: hidden;
    position: relative;

    // Prevent interacting with the content outside the dialog. A click should only open the dialog with the full content.
    // E.g. a link inside content would cause a page change, in addition to opening the dialog, which is not intended.
    pointer-events: none;
`);

const Icon = styled("div")(css`
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
    font-size: 12px;
    line-height: 0;
    background-color: inherit;
    border-bottom-left-radius: 3px;
`);

const DialogPaper = styled(Paper)(
    css`
        overflow: hidden;

        // TODO: Consider a generic solution for height and max-height in dialogs.
        height: calc(100vh - 100px);

        && {
            max-height: 600px;
        }
    `,
);

const DialogTitle = styled(MuiDialogTitle)(
    css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
);

const DialogContent = styled(MuiDialogContent)(
    ({ theme }) => css`
        min-height: 0;
        box-sizing: border-box;
        overflow: visible;

        && {
            padding: ${theme.spacing(4)};
        }
    `,
);

const InnerDialogContent = styled("div")(
    ({ theme }) => css`
        background-color: white;
        border: 1px dashed ${theme.palette.grey[100]};
        border-radius: 3px;
        padding: ${theme.spacing(2)};
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
    `,
);

export const ContentOverflow = ({
    children,
    iconMapping = {},
    dialogTitle = <FormattedMessage id="comet.contentOverflow.dialogTitle" defaultMessage="Preview" />,
}: ContentOverflowProps) => {
    const [open, setOpen] = React.useState(false);
    const { openDialog: openDialogIcon = <Maximize fontSize="inherit" />, closeDialog: closeDialogIcon = <Close /> } = iconMapping;

    return (
        <>
            <Root>
                <ClickableContent onClick={() => setOpen(true)}>
                    <ContentContainer>{children}</ContentContainer>
                    <Icon>{openDialogIcon}</Icon>
                </ClickableContent>
            </Root>
            <Dialog open={open} onClose={() => setOpen(false)} PaperComponent={DialogPaper}>
                <DialogTitle>
                    {dialogTitle}
                    <IconButton color="inherit" onClick={() => setOpen(false)}>
                        {closeDialogIcon}
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <InnerDialogContent>{children}</InnerDialogContent>
                </DialogContent>
            </Dialog>
        </>
    );
};
