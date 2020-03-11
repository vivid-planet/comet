import { Drawer as Sidebar } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import * as React from "react";
import { Form, useForm } from "react-final-form";

import { Field } from "../form";
import { PopOverFormField, SidebarForm } from "./filterbar-components";
import * as sc from "./FilterBar.sc";

export type FilterType = "text" | "range" | "multiValues";

interface IMinMaxValue {
    min: number;
    max: number;
}

export interface IField {
    type: FilterType;
    name: string;
    label: string;
    labelValue?: (value: any) => string;
    placeHolder: string;
    component: React.ComponentType<any>;
}

interface IFilterBarProps {
    fieldBarWidth: number;
    fieldSidebarHeight: number;
    fields: IField[];
}

type VisibleFieldsType = {
    [key in string]: boolean;
};

export const labelValueFunctions: { [key in FilterType]: (value: any) => string } = {
    text: (value: string) => value,
    range: (value: IMinMaxValue) => `${value.min} - ${value.max}`,
    multiValues: (value: string[]) => `${value.join(",")}`,
};

let visibleFilterCount: number;
export const FilterBar: React.FC<IFilterBarProps> = ({ fieldBarWidth, fieldSidebarHeight, fields }) => {
    const filterForm = useForm();
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [showSidebar, setShowSidebar] = React.useState<boolean>(false);
    const [visibleFields, setVisibleFields] = React.useState<VisibleFieldsType>({});

    React.useEffect(() => {
        fields.map((field, index) => {
            visibleFields[field.name] = index < Math.trunc((wrapperRef!.current!.getBoundingClientRect().width - 74) / fieldBarWidth);
        });

        setVisibleFields(visibleFields);
    }, [fields]);

    React.useEffect(() => {
        const handleVisibilityFilters = () => {
            const t = Math.trunc((wrapperRef!.current!.getBoundingClientRect().width - 74) / fieldBarWidth);
            if (t !== visibleFilterCount) {
                Object.keys(visibleFields).map((fieldName, index) => {
                    visibleFields[fieldName] = index < t;
                });
                visibleFilterCount = t;
                setVisibleFields({ ...visibleFields });
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
        <Form
            onSubmit={(props) => {
                // nothing todo
            }}
        >
            {({ form }) => (
                <sc.Wrapper ref={wrapperRef}>
                    <sc.BarWrapper>
                        {fields
                            .filter((field) => visibleFields[field.name])
                            .map((field, index) => {
                                return (
                                    <sc.FieldBarWrapper key={index} fieldBarWidth={fieldBarWidth}>
                                        <Field
                                            fieldContainerComponent={sc.FieldContainerDiv}
                                            type="query"
                                            name={field.name}
                                            component={PopOverFormField}
                                            isClearable
                                            field={field}
                                            handleSubmit={() => {
                                                filterForm.change(field.name, form.getFieldState(field.name)!.value);
                                            }}
                                        />
                                    </sc.FieldBarWrapper>
                                );
                            })}
                        {/*Object.values(visibleFields).filter((item, index, array) => array.indexOf(item) === index) => aus einem Array die doppelten werte entfernen wenn 2 werte in array => es befinden sich*/}
                        {/*filter die nicht sichtbar sind => more Button anzeigen*/}
                        {Object.values(visibleFields).filter((item, index, array) => array.indexOf(item) === index).length === 2 && (
                            <sc.MoreButtonWrapper fieldBarWidth={fieldBarWidth} onClick={handleDrawerState}>
                                <MoreHoriz />
                            </sc.MoreButtonWrapper>
                        )}
                    </sc.BarWrapper>
                    <Sidebar anchor="right" open={showSidebar}>
                        <sc.SidebarInnerWrapper>
                            <SidebarForm
                                handleSubmit={() => {
                                    filterForm.batch(() => {
                                        fields
                                            .filter((field) => !visibleFields[field.name])
                                            .map((field) => {
                                                filterForm.change(field.name, form.getFieldState(field.name)!.value);
                                            });
                                    });
                                }}
                                sidebarFields={fields.filter((field) => !visibleFields[field.name])}
                                fieldSidebarHeight={fieldSidebarHeight}
                                handleClose={handleDrawerState}
                            />
                        </sc.SidebarInnerWrapper>
                    </Sidebar>
                </sc.Wrapper>
            )}
        </Form>
    );
};
