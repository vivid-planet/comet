import { CancelButton, MainContent, SaveBoundary, SaveBoundarySaveButton, Stack, StackPage, StackSwitch, StackToolbar } from "@comet/admin";
import { Add as AddIcon } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useContentScope } from "@src/common/ContentScopeProvider";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormBuilderAddForm } from "./FormBuilderAddForm";
import FormBuilderPreviewAndForm from "./FormBuilderPreviewAndForm";
import { FormBuildersGrid } from "./generated/FormBuildersGrid";

export const FormBuilderPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { scope } = useContentScope();
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "formBuilderPage.formBuilder", defaultMessage: "Form Builder" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar />
                    <MainContent fullHeight>
                        <FormBuildersGrid
                            toolbarAction={
                                <Button startIcon={<AddIcon />} variant="contained" color="primary" onClick={() => setShowAddDialog(true)}>
                                    <FormattedMessage id="formBuilderPage.createForm" defaultMessage="Create Form" />
                                </Button>
                            }
                        />
                    </MainContent>
                    <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                        <SaveBoundary onAfterSave={() => setShowAddDialog(false)}>
                            <DialogTitle>
                                <FormattedMessage id="formBuilderPage.newForm" defaultMessage="New Form" />
                            </DialogTitle>
                            <DialogContent>
                                <FormBuilderAddForm scope={scope} />
                            </DialogContent>
                            <DialogActions>
                                <CancelButton onClick={() => setShowAddDialog(false)} />
                                <SaveBoundarySaveButton />
                            </DialogActions>
                        </SaveBoundary>
                    </Dialog>
                </StackPage>
                <StackPage name="edit">{(id) => <FormBuilderPreviewAndForm id={id} />}</StackPage>
            </StackSwitch>
        </Stack>
    );
};
