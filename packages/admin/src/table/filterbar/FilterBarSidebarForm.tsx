import { Button, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Cancel, Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { Form, useForm } from "react-final-form";

import { IFilterBarField } from "./filterbar";

interface ISidebarFormProps {
    handleClose: () => void;
    sidebarFields: IFilterBarField[];
    fieldSidebarHeight: number;
}

interface StyleProps {
    fieldSidebarHeight: number;
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        fieldSidebarWrapper: {
            maxHeight: (props: StyleProps) => `${props.fieldSidebarHeight}px`,
            borderTop: `1px solid ${theme.palette.grey[300]}`,
        },
        filterContainer: {},
        styledFieldHeaderBox: {
            padding: "20px 20px 0 20px",
        },
        styledFieldBox: {
            minWidth: "300px",
            padding: "20px",
        },
        submitContainer: {
            borderTop: "1px solid #cecfcf",
            padding: "20px",
        },
        submitButton: {
            padding: "10px 19px",
        },
        resetButton: {
            marginTop: "20px",
            padding: "0 8px",
        },
        closeButton: {
            justifyContent: "start",
            padding: "20px",
        },
    }),
    { name: "CometAdminFilterBarSidebarForm" },
);

export const FilterBarSidebarForm: React.FunctionComponent<ISidebarFormProps> = ({ sidebarFields, fieldSidebarHeight, handleClose }) => {
    const outerForm = useForm();
    const { values } = outerForm.getState();

    const classes = useStyles({ fieldSidebarHeight: fieldSidebarHeight });

    return (
        <>
            <Form
                onSubmit={(values, form) => {
                    outerForm.batch(() => {
                        sidebarFields.map((field) => {
                            outerForm.change(field.name, form.getFieldState(field.name)!.value);
                        });
                    });
                }}
                initialValues={values}
            >
                {({ form, handleSubmit }) => (
                    <>
                        <Button
                            classes={{ root: classes.closeButton }}
                            fullWidth={true}
                            startIcon={<Cancel />}
                            type="button"
                            variant="text"
                            onClick={handleClose}
                        >
                            <Typography variant={"button"}>{"Abbrechen"}</Typography>
                        </Button>
                        {sidebarFields.map((field, index) => {
                            return (
                                <div className={classes.fieldSidebarWrapper} key={index}>
                                    <div className={classes.filterContainer}>
                                        <div className={classes.styledFieldHeaderBox}>
                                            <Typography variant="subtitle2">{field.label}</Typography>
                                            <Typography
                                                display="block"
                                                variant="caption"
                                                style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                            >
                                                {values[field.name] === undefined ? field.placeHolder : field.labelValueFunction(values[field.name])}
                                            </Typography>
                                        </div>
                                        <div className={classes.styledFieldBox}>
                                            {React.createElement(field.component)}
                                            <Button
                                                classes={{ root: classes.resetButton }}
                                                fullWidth={true}
                                                startIcon={<Refresh />}
                                                variant="text"
                                                onClick={() => {
                                                    form.change(field.name, undefined);
                                                    handleSubmit();
                                                }}
                                            >
                                                <Typography variant={"button"}>{"Zurücksetzen"}</Typography>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className={classes.submitContainer}>
                            <Button
                                classes={{ root: classes.submitButton }}
                                type="submit"
                                color="primary"
                                variant="contained"
                                onClick={handleSubmit}
                                fullWidth={true}
                            >
                                {"Übernehmen"}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
};
