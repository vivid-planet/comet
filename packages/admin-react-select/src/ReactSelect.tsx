import { InputBase } from "@comet/admin";
import { Chip, InputBaseProps, MenuItem, Paper, Theme, Typography, WithStyles } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import { SvgIconComponent } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import DropdownIcon from "@material-ui/icons/KeyboardArrowDown";
import { withStyles } from "@material-ui/styles";
import classNames from "classnames";
import * as React from "react";
import Select from "react-select";
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

import styles from "./ReactSelect.styles";

function NoOptionsMessage<OptionType>(props: NoticeProps<OptionType>) {
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

function Control<OptionType>(props: ControlProps<OptionType>) {
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

function Option<OptionType>(props: OptionProps<OptionType>) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            disabled={props.isDisabled}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder<OptionType>(props: PlaceholderProps<OptionType>) {
    return (
        <div className={props.selectProps.classes.placeholder} {...props.innerProps}>
            {props.children}
        </div>
    );
}

function SingleValue<OptionType>(props: SingleValueProps<OptionType>) {
    return (
        <div className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </div>
    );
}

function ValueContainer<OptionType>(props: ValueContainerProps<OptionType>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue<OptionType>(props: MultiValueProps<OptionType>) {
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

function Menu<OptionType>(props: MenuProps<OptionType>) {
    return (
        <Paper className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

function IndicatorsContainer<OptionType>(props: IndicatorContainerProps<OptionType>) {
    return <div className={props.selectProps.classes.indicatorsContainer}>{props.children}</div>;
}

function IndicatorSeparator<OptionType>(props: IndicatorContainerProps<OptionType>) {
    return <span className={props.selectProps.classes.indicatorSeparator} />;
}

function ClearIndicator<OptionType>({ selectProps, clearValue }: IndicatorProps<OptionType>) {
    const Icon = selectProps.clearIcon ? selectProps.clearIcon : ClearIcon;
    return (
        <div className={`${selectProps.classes.indicator} ${selectProps.classes.clearIndicator}`} onClick={clearValue}>
            <Icon fontSize="inherit" color="inherit" />
        </div>
    );
}

function DropdownIndicator<OptionType>({ selectProps }: IndicatorProps<OptionType>) {
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

export interface CometAdminSelectProps<OptionType> {
    theme: Theme;
    selectComponent: React.ComponentType<ReactSelectProps<OptionType>>;
    clearIcon?: SvgIconComponent;
    dropdownIcon?: SvgIconComponent;
    dropdownIconOpen?: SvgIconComponent;
}

class SelectWrapper<OptionType> extends React.Component<
    WithStyles<typeof styles> & CometAdminSelectProps<OptionType> & ReactSelectProps<OptionType>
> {
    public render() {
        const { classes, theme, components: origComponents, selectComponent, ...rest } = this.props;
        const SelectComponent = this.props.selectComponent;
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
}
const ExtendedSelectWrapper = withStyles(styles, { name: "CometAdminSelect", withTheme: true })(SelectWrapper);

const reactSelectStyles = {
    menuPortal: (styles: any) => ({ ...styles, zIndex: zIndex.modal }),
};

export class ReactSelect<OptionType> extends React.Component<ReactSelectProps<OptionType>> {
    public render() {
        return <ExtendedSelectWrapper selectComponent={Select} {...this.props} styles={{ ...reactSelectStyles }} />;
    }
}
export class ReactSelectAsync<OptionType> extends React.Component<ReactSelectAsyncProps<OptionType>> {
    public render() {
        return <ExtendedSelectWrapper selectComponent={AsyncSelect} {...this.props} styles={{ ...reactSelectStyles }} />;
    }
}
export class ReactSelectCreatable<OptionType> extends React.Component<ReactSelectCreatableProps<OptionType>> {
    public render() {
        return <ExtendedSelectWrapper selectComponent={CreatableSelect} {...this.props} styles={{ ...reactSelectStyles }} />;
    }
}
export class ReactSelectAsyncCreatable<OptionType> extends React.Component<
    ReactSelectCreatableProps<OptionType> & ReactSelectAsyncProps<OptionType>
> {
    public render() {
        return <ExtendedSelectWrapper selectComponent={AsyncCreatableSelect} {...this.props} styles={{ ...reactSelectStyles }} />;
    }
}
