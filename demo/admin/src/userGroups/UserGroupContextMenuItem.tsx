import { Field, FinalFormSelect, messages } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, MenuItem } from "@mui/material";
import { GQLUserGroup } from "@src/graphql.generated";
import * as React from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { userGroupOptions } from "./userGroupOptions";

interface UserGroupItem {
    key: string;
    visible: boolean;
    type?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any;
    userGroup: GQLUserGroup;
}

interface Props {
    item: UserGroupItem;
    onChange: (item: UserGroupItem) => void;
    onMenuClose: () => void;
}

function UserGroupContextMenuItem({ item, onChange, onMenuClose }: Props): JSX.Element {
    const [dialogOpen, setDialogOpen] = React.useState(false);

    interface FormValues {
        userGroup: GQLUserGroup;
    }

    const handleSubmit = (values: FormValues) => {
        onChange({ ...item, userGroup: values.userGroup });
        setDialogOpen(false);
        onMenuClose();
    };

    return (
        <>
            <MenuItem
                onClick={() => {
                    setDialogOpen(true);
                }}
            >
                <ListItemIcon>
                    <Account />
                </ListItemIcon>
                <FormattedMessage id="pageContentBlock.userGroup.menuItem" defaultMessage="Visibility rules" />
            </MenuItem>
            <Dialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    onMenuClose();
                }}
            >
                <DialogTitle>
                    <FormattedMessage id="pageContentBlock.userGroup.dialogTitle" defaultMessage="Visibility rules" />
                </DialogTitle>
                <Form<FormValues> onSubmit={handleSubmit} initialValues={{ userGroup: item.userGroup }}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogContent>
                                <Field name="userGroup" fullWidth required>
                                    {(props) => (
                                        <FinalFormSelect {...props}>
                                            {userGroupOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setDialogOpen(false);
                                        onMenuClose();
                                    }}
                                >
                                    <FormattedMessage {...messages.cancel} />
                                </Button>
                                <Button type="submit" variant="contained">
                                    <FormattedMessage {...messages.ok} />
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Form>
            </Dialog>
        </>
    );
}

export { UserGroupContextMenuItem };
