/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIconComponent } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import DropdownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Chip, ComponentsOverrides, InputBase, InputBaseProps, MenuItem, Paper, Theme, Typography, useTheme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import classNames from "classnames";
import * as React from "react";
import Select, { OptionTypeBase } from "react-select";
import AsyncSelect, { Props as ReactSelectAsyncProps } from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Props as ReactSelectProps } from "react-select/base";
import CreatableSelect, { Props as ReactSelectCreatableProps } from "react-select/creatable";
import { IndicatorContainerProps, ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { IndicatorProps } from "react-select/src/components/indicators";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { MultiValueProps } from "react-select/src/components/MultiValue";
import { OptionProps } from "react-select/src/components/Option";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { SingleValueProps } from "react-select/src/components/SingleValue";

import styles, { SelectClassKey } from "./ReactSelect.styles";

function NoOptionsMessage<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: NoticeProps<OptionType, IsMulti>) {
    return (
        <Typography className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }: any) {
    return <div ref={inputRef} {...props} />;
}

export const ControlInput = ({ ...props }: InputBaseProps) => <InputBase classes={{ root: "root", focused: "focused" }} {...props} />;

function Control<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ControlProps<OptionType, IsMulti>) {
    const InputProps = {
        inputComponent,
        inputProps: {
            className: props.selectProps.classes.input,
            inputRef: props.innerRef,
            children: props.children,
            ...props.innerProps,
        },
    };
    return <ControlInput type="text" fullWidth {...InputProps} {...props.selectProps.textFieldProps} />;
}

function Option<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: OptionProps<OptionType, IsMulti>) {
    const rootClasses: string[] = [props.selectProps.classes.option];
    if (props.isFocused) rootClasses.push(props.selectProps.classes.optionFocused);
    if (props.isSelected) rootClasses.push(props.selectProps.classes.optionSelected);
    return (
        <MenuItem
            classes={{ root: rootClasses.join(" ") }}
            ref={props.innerRef}
            selected={props.isSelected}
            disabled={props.isDisabled}
            component="div"
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: PlaceholderProps<OptionType, IsMulti>) {
    return (
        <div className={props.selectProps.classes.placeholder} {...props.innerProps}>
            {props.children}
        </div>
    );
}

function SingleValue<OptionType extends OptionTypeBase>(props: SingleValueProps<OptionType>) {
    return (
        <div className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </div>
    );
}

function ValueContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ValueContainerProps<OptionType, IsMulti>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue<OptionType extends OptionTypeBase>(props: MultiValueProps<OptionType>) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: MenuProps<OptionType, IsMulti>) {
    return (
        <Paper className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

function IndicatorsContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <div className={props.selectProps.classes.indicatorsContainer}>{props.children}</div>;
}

function IndicatorSeparator<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <span className={props.selectProps.classes.indicatorSeparator} />;
}

function ClearIndicator<OptionType extends OptionTypeBase, IsMulti extends boolean>({
    selectProps,
    clearValue,
}: IndicatorProps<OptionType, IsMulti>) {
    const Icon = selectProps.clearIcon ? selectProps.clearIcon : ClearIcon;
    return (
        <div className={`${selectProps.classes.indicator} ${selectProps.classes.clearIndicator}`} onClick={clearValue}>
            <Icon fontSize="inherit" color="inherit" />
        </div>
    );
}

function DropdownIndicator<OptionType extends OptionTypeBase, IsMulti extends boolean>({ selectProps }: IndicatorProps<OptionType, IsMulti>) {
    const DefaultIcon = selectProps.dropdownIcon ? selectProps.dropdownIcon : DropdownIcon;
    const OpenIcon = selectProps.dropdownIconOpen ? selectProps.dropdownIconOpen : DropdownIcon;
    const Icon = selectProps.menuIsOpen ? OpenIcon : DefaultIcon;

    return (
        <div className={`${selectProps.classes.indicator} ${selectProps.classes.dropdownIndicator}`}>
            <Icon fontSize="inherit" color="inherit" />
        </div>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
    IndicatorsContainer,
    IndicatorSeparator,
    ClearIndicator,
    DropdownIndicator,
};

export interface SelectProps<OptionType extends OptionTypeBase> {
    theme: Theme;
    selectComponent: React.ComponentType<ReactSelectProps<OptionType>>;
    clearIcon?: SvgIconComponent;
    dropdownIcon?: SvgIconComponent;
    dropdownIconOpen?: SvgIconComponent;
}

function SelectWrapper<OptionType extends OptionTypeBase>({
    classes,
    theme,
    components: origComponents,
    selectComponent: SelectComponent,
    ...rest
}: WithStyles<typeof styles> & SelectProps<OptionType> & ReactSelectProps<OptionType>) {
    return (
        <SelectComponent
            classes={classes}
            menuPortalTarget={document.body}
            components={{ ...components, ...origComponents }}
            placeholder=""
            {...rest}
        />
    );
}

const ExtendedSelectWrapper = withStyles(styles, { name: "CometAdminSelect" })(SelectWrapper);

const useReactSelectStyles = () => {
    const { zIndex } = useTheme();
    return {
        menuPortal: (styles: any) => ({ ...styles, zIndex: zIndex.modal }),
    };
};

export function ReactSelect<OptionType extends OptionTypeBase>(props: ReactSelectProps<OptionType>) {
    const reactSelectStyles = useReactSelectStyles();
    return <ExtendedSelectWrapper selectComponent={Select} {...props} styles={{ ...reactSelectStyles }} />;
}

export function ReactSelectAsync<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ReactSelectAsyncProps<OptionType, IsMulti>) {
    const reactSelectStyles = useReactSelectStyles();
    return <ExtendedSelectWrapper selectComponent={AsyncSelect} {...props} styles={{ ...reactSelectStyles }} />;
}

export function ReactSelectCreatable<OptionType extends OptionTypeBase, IsMulti extends boolean>(
    props: ReactSelectCreatableProps<OptionType, IsMulti>,
) {
    const reactSelectStyles = useReactSelectStyles();
    return <ExtendedSelectWrapper selectComponent={CreatableSelect} {...props} styles={{ ...reactSelectStyles }} />;
}

export function ReactSelectAsyncCreatable<OptionType extends OptionTypeBase, IsMulti extends boolean>(
    props: ReactSelectCreatableProps<OptionType, IsMulti> & ReactSelectAsyncProps<OptionType, IsMulti>,
) {
    const reactSelectStyles = useReactSelectStyles();
    return <ExtendedSelectWrapper selectComponent={AsyncCreatableSelect} {...props} styles={{ ...reactSelectStyles }} />;
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminSelect: SelectClassKey;
    }

    interface ComponentsPropsList {
        CometAdminSelect: Partial<SelectProps<any>>;
    }

    interface Components {
        CometAdminSelect?: {
            defaultProps?: ComponentsPropsList["CometAdminSelect"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSelect"];
        };
    }
}
