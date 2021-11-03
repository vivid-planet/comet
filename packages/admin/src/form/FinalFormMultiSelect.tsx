import { Check } from "@comet/admin-icons";
import { createStyles, List, ListItem, ListItemIcon, ListItemText, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

/*---------------- FinalFormMultiSelectListItemComponent ----------------*/

interface FinalFormMultiSelectListDefaultItemProps {
    option: Option;
    isSelected: boolean;
}

function FinalFormMultiSelectListDefaultItem({ option, isSelected }: FinalFormMultiSelectListDefaultItemProps) {
    return (
        <>
            {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
            <ListItemText>{option.label}</ListItemText>
            {isSelected && <Check />}
        </>
    );
}

/*---------------- FinalFormMultiSelectComponent ----------------*/

export interface Option {
    label: string | React.ReactNode;
    value: string;
    icon?: React.ReactNode;
}

interface FinalFormMultiSelectProps extends FieldRenderProps<string, HTMLDivElement> {
    options: Option[];
    renderItem?: (option: Option) => React.ReactNode;
}

export type FinalFormMultiSelectClassKey = "root" | "listItem" | "listItemSelected";
const styles = () => {
    return createStyles<FinalFormMultiSelectClassKey, FinalFormMultiSelectProps>({
        root: {},
        listItem: {},
        listItemSelected: {},
    });
};

function FinalFormMultiSelectComponent({ options, renderItem, input, classes }: WithStyles<typeof styles> & FinalFormMultiSelectProps) {
    const handleListItemClick = (value: string) => {
        if (Array.isArray(input.value)) {
            if (input.value.includes(value)) {
                if ([...input.value.filter((item) => item !== value)].length === 0) {
                    input.onChange(undefined);
                } else {
                    input.onChange([...input.value.filter((item) => item !== value)]);
                }
            } else {
                input.onChange([value, ...input.value]);
            }
        } else {
            input.onChange([value]);
        }
    };

    return (
        <List
            classes={{
                root: classes.root,
            }}
        >
            {options.map((option, index) => {
                const isSelected = input.value?.includes(option.value);
                return (
                    <ListItem
                        key={index}
                        classes={{
                            root: classes.listItem,
                            selected: classes.listItemSelected,
                        }}
                        onClick={() => handleListItemClick(option.value)}
                        selected={isSelected}
                        button
                    >
                        {renderItem ? renderItem(option) : <FinalFormMultiSelectListDefaultItem option={option} isSelected={isSelected} />}
                    </ListItem>
                );
            })}
        </List>
    );
}

export const FinalFormMultiSelect = withStyles(styles, { name: "CometAdminFinalFormMultiSelect" })(FinalFormMultiSelectComponent);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormMultiSelect: FinalFormMultiSelectClassKey;
    }
}
