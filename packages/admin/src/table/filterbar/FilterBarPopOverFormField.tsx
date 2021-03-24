import { Box, Button, Popover, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Cancel, Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { FieldRenderProps, Form, useForm } from "react-final-form";

import { IFilterBarField } from "./FilterBar";

export type CometAdminFilterBarPopOverFormFieldClassKeys =
    | "root"
    | "styledBox"
    | "popoverContentContainer"
    | "buttonsContainer"
    | "submitContainer"
    | "resetCloseContainer";

interface StyleProps {
    open: boolean;
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            position: "relative",

            "&:before": {
                opacity: (props: StyleProps) => (props.open ? 1 : 0),
                transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
                borderLeft: `1px solid ${theme.palette.grey[300]}`,
                borderTop: `1px solid ${theme.palette.grey[300]}`,
                transform: "rotateZ(45deg)",
                backgroundColor: "#ffffff",
                position: "absolute",
                display: "block",
                bottom: "-20px",
                height: "10px",
                content: '""',
                width: "10px",
                left: "50%",
            },
        },
        styledBox: {
            position: "relative",
            padding: "20px",

            "&:after": {
                borderRight: "4px solid transparent",
                borderLeft: "4px solid transparent",
                borderTop: `4px solid ${theme.palette.grey[300]}`,
                position: "absolute",
                display: "block",
                content: "''",
                height: 0,
                width: 0,
                right: "20px",
                top: "50%",
            },
        },
        popoverContentContainer: {
            border: `1px solid ${theme.palette.grey[300]}`,

            "& [class*='CometAdminFormFieldContainer-root']": {
                padding: "20px",
                boxSizing: "border-box",
                marginBottom: 0,
            },
        },
        buttonsContainer: {
            borderTop: `1px solid ${theme.palette.grey[300]}`,
            padding: "20px",
        },
        submitContainer: {
            marginBottom: "20px",
        },
        resetCloseContainer: {
            justifyContent: "space-between",
            display: "flex",
        },
    }),
    { name: "CometAdminFilterBarPopOverFormField" },
);

interface IFormFieldProps extends FieldRenderProps<any> {
    field: IFilterBarField;
    handleSubmit: () => void;
}

export const FilterBarPopOverFormField: React.FunctionComponent<IFormFieldProps> = ({ field }) => {
    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { values } = outerForm.getState();
    const classes = useStyles({ open: open });

    return (
        <Form
            onSubmit={(values) => {
                outerForm.change(field.name, values[field.name]);
            }}
            initialValues={values}
        >
            {({ form, handleSubmit }) => (
                <div className={classes.root}>
                    <div className={classes.styledBox} onClick={handleClick}>
                        <Typography variant="subtitle2">{field.label}</Typography>
                        <Typography display="block" variant="caption" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {values[field.name] === undefined ? field.placeHolder : field.labelValueFunction(values[field.name])}
                        </Typography>
                    </div>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: -15,
                            horizontal: 65,
                        }}
                        PaperProps={{ square: true }}
                        classes={{
                            paper: "paper",
                        }}
                    >
                        <div className={classes.popoverContentContainer}>
                            <Box style={{ minWidth: 300 }}>
                                {React.createElement(field.component)}
                                <div className={classes.buttonsContainer}>
                                    <div className={classes.submitContainer}>
                                        <Button
                                            fullWidth={true}
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                            onClick={() => {
                                                handleSubmit();
                                                handleClose();
                                            }}
                                        >
                                            {"Übernehmen"}
                                        </Button>
                                    </div>
                                    <div className={classes.resetCloseContainer}>
                                        <Button
                                            startIcon={<Refresh />}
                                            type="reset"
                                            variant="text"
                                            onClick={() => {
                                                outerForm.change(field.name, undefined);
                                                form.change(field.name, undefined);
                                                handleClose();
                                            }}
                                        >
                                            <Typography variant={"button"}>{"Zurücksetzen"}</Typography>
                                        </Button>
                                        <Button startIcon={<Cancel />} type="button" variant="text" onClick={handleClose}>
                                            <Typography variant={"button"}>{"Abbrechen"}</Typography>
                                        </Button>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </Popover>
                </div>
            )}
        </Form>
    );
};
