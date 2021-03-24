import { Drawer as Sidebar, Theme } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { Field } from "../../form";
import { FilterBarPopOverFormField } from "./FilterBarPopOverFormField";
import { FilterBarSidebarForm } from "./FilterBarSidebarForm";

export type CometAdminFilterBarClassKeys = "root" | "barWrapper" | "sidebarInnerWrapper" | "fieldBarWrapper" | "moreButtonWrapper";

interface StyleProps {
    fieldBarWidth: number;
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            "& [class*='CometAdminFormFieldContainer-root']": {
                marginBottom: 0,
                borderLeft: `1px solid ${theme.palette.grey[300]}`,
                borderTop: `1px solid ${theme.palette.grey[300]}`,
            },
        },
        barWrapper: {
            display: "flex",
        },
        sidebarInnerWrapper: {},
        fieldBarWrapper: {
            minWidth: (props: StyleProps) => `${props.fieldBarWidth}px`,
            position: "relative",
            "&:last-child": {
                borderRight: `1px solid ${theme.palette.grey[300]}`,
            },
        },
        moreButtonWrapper: {
            borderLeft: `1px solid ${theme.palette.grey[300]}`,
            borderRight: `1px solid ${theme.palette.grey[300]}`,
            borderTop: `1px solid ${theme.palette.grey[300]}`,
            justifyContent: "center",
            display: "inline-flex",
            alignItems: "center",
            textAlign: "center",
            fontSize: "30px",
            flexGrow: 1,
        },
    }),
    { name: "CometAdminFilterBar" },
);

export interface IFilterBarField {
    name: string;
    label: string;
    labelValueFunction: (value: any) => string;
    placeHolder: string;
    component: React.ComponentType<any>;
}

interface IFilterBarProps {
    fieldBarWidth: number;
    fieldSidebarHeight: number;
    fields: IFilterBarField[];
}

type VisibleFieldsType = {
    [key in string]: boolean;
};

let visibleFilterCount: number;
export const FilterBar: React.FunctionComponent<IFilterBarProps> = ({ fieldBarWidth, fieldSidebarHeight, fields }) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [showSidebar, setShowSidebar] = React.useState<boolean>(false);
    const [visibleFields, setVisibleFields] = React.useState<VisibleFieldsType>({});
    const classes = useStyles({ fieldBarWidth: fieldBarWidth });

    React.useEffect(() => {
        fields.map((field, index) => {
            if (wrapperRef && wrapperRef.current) {
                visibleFields[field.name] = index < Math.trunc((wrapperRef.current!.getBoundingClientRect().width - 74) / fieldBarWidth);
            }
        });

        setVisibleFields(visibleFields);
    }, [visibleFields]);

    React.useEffect(() => {
        const handleVisibilityFilters = () => {
            if (wrapperRef && wrapperRef.current) {
                const t = Math.trunc((wrapperRef.current!.getBoundingClientRect().width - 74) / fieldBarWidth);
                if (t !== visibleFilterCount) {
                    Object.keys(visibleFields).map((fieldName, index) => {
                        visibleFields[fieldName] = index < t;
                    });
                    visibleFilterCount = t;
                    setVisibleFields({ ...visibleFields });
                }
            }
        };
        window.addEventListener("resize", handleVisibilityFilters);

        return () => {
            window.removeEventListener("resize", handleVisibilityFilters);
        };
    });

    const handleDrawerState = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className={classes.root} ref={wrapperRef}>
            <div className={classes.barWrapper}>
                {fields
                    .filter((field) => visibleFields[field.name])
                    .map((field, index) => {
                        return (
                            <div className={classes.fieldBarWrapper} style={{ minWidth: fieldBarWidth }} key={index}>
                                <Field type="query" name={field.name} component={FilterBarPopOverFormField} isClearable field={field} />
                            </div>
                        );
                    })}
                {/*Object.values(visibleFields).filter((item, index, array) => array.indexOf(item) === index) => aus einem Array die doppelten werte entfernen wenn 2 werte in array => es befinden sich*/}
                {/*filter die nicht sichtbar sind => more Button anzeigen*/}
                {Object.values(visibleFields).filter((item, index, array) => array.indexOf(item) === index).length === 2 && (
                    <div className={classes.moreButtonWrapper} onClick={handleDrawerState}>
                        <MoreHoriz />
                    </div>
                )}
            </div>
            <Sidebar anchor="right" open={showSidebar}>
                <div className={classes.sidebarInnerWrapper}>
                    <FilterBarSidebarForm
                        sidebarFields={fields.filter((field) => !visibleFields[field.name])}
                        fieldSidebarHeight={fieldSidebarHeight}
                        handleClose={handleDrawerState}
                    />
                </div>
            </Sidebar>
        </div>
    );
};
