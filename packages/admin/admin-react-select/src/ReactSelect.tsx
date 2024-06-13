/* eslint-disable @typescript-eslint/no-explicit-any */
<<<<<<< HEAD
import { createComponentSlot } from "@comet/admin";
import { SvgIconComponent } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import DropdownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Chip, ComponentsOverrides, InputBase, inputBaseClasses, MenuItem, Paper, Theme, Typography, useTheme } from "@mui/material";
import { css } from "@mui/material/styles";
=======
import { ChevronDown, Clear, Close } from "@comet/admin-icons";
import { Chip, ComponentsOverrides, InputBase, InputBaseProps, MenuItem, Paper, SvgIconProps, Theme, Typography, useTheme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import classNames from "classnames";
>>>>>>> main
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

export type SelectClassKey =
    | "input"
    | "valueContainer"
    | "chip"
    | "chipFocused"
    | "noOptionsMessage"
    | "singleValue"
    | "placeholder"
    | "paper"
    | "indicatorsContainer"
    | "indicatorSeparator"
    | "clearIndicator"
    | "indicator"
    | "dropdownIndicator"
    | "option"
    | "optionSelected"
    | "optionFocused";

const NoOptionsMessageText = createComponentSlot(Typography)<SelectClassKey>({
    componentName: "Select",
    slotName: "noOptionsMessage",
})(
    ({ theme }) => css`
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        color: ${theme.palette.text.secondary};
    `,
);

function NoOptionsMessage<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: NoticeProps<OptionType, IsMulti>) {
    return <NoOptionsMessageText {...props.innerProps}>{props.children}</NoOptionsMessageText>;
}

function inputComponent({ inputRef, ...props }: any) {
    return <div ref={inputRef} {...props} />;
}

const ControlInput = createComponentSlot(InputBase)<SelectClassKey>({
    componentName: "Select",
    slotName: "input",
})(css`
    .${inputBaseClasses.input} {
        display: flex;
        padding-right: 0;
    }
`);

function Control<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ControlProps<OptionType, IsMulti>) {
    const InputProps = {
        inputComponent,
        inputProps: {
            inputRef: props.innerRef,
            children: props.children,
            ...props.innerProps,
        },
    };
    return <ControlInput type="text" fullWidth {...InputProps} {...props.selectProps.textFieldProps} />;
}

type OptionMenuItemState = {
    focused: boolean;
    selected: boolean;
};

const OptionMenuItem = createComponentSlot(MenuItem)<SelectClassKey, OptionMenuItemState>({
    componentName: "Select",
    slotName: "option",
    classesResolver(ownerState) {
        return [ownerState.focused && "optionFocused", ownerState.selected && "optionSelected"];
    },
})(
    ({ theme, ownerState }) => css`
        ${ownerState.selected &&
        css`
            font-weight: ${theme.typography.fontWeightMedium};
        `}

        ${ownerState.focused &&
        css`
            background-color: ${theme.palette.action.selected};
        `}
    `,
);

function Option<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: OptionProps<OptionType, IsMulti>) {
    return (
        <OptionMenuItem
            ref={props.innerRef}
            selected={props.isSelected}
            ownerState={{ focused: props.isFocused, selected: props.isSelected }}
            disabled={props.isDisabled}
            // @ts-expect-error The type is not correctly passed through to `MenuItem` when using `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
            component="div"
            {...props.innerProps}
        >
            {props.children}
        </OptionMenuItem>
    );
}

const PlaceholderSlot = createComponentSlot("div")<SelectClassKey>({
    componentName: "Select",
    slotName: "placeholder",
})(
    ({ theme }) => css`
        color: ${theme.palette.text.disabled};
    `,
);

function Placeholder<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: PlaceholderProps<OptionType, IsMulti>) {
    return <PlaceholderSlot {...props.innerProps}>{props.children}</PlaceholderSlot>;
}

const SingleValueSlot = createComponentSlot("div")<SelectClassKey>({
    componentName: "Select",
    slotName: "singleValue",
})(css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`);

function SingleValue<OptionType extends OptionTypeBase>(props: SingleValueProps<OptionType>) {
    return <SingleValueSlot {...props.innerProps}>{props.children}</SingleValueSlot>;
}

const ValueContainerSlot = createComponentSlot("div")<SelectClassKey>({
    componentName: "Select",
    slotName: "valueContainer",
})(css`
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    align-items: center;
    overflow: hidden;
`);

function ValueContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ValueContainerProps<OptionType, IsMulti>) {
    return <ValueContainerSlot>{props.children}</ValueContainerSlot>;
}

const MultiValueChip = createComponentSlot(Chip)<SelectClassKey, { focused: boolean }>({
    componentName: "Select",
    slotName: "chip",
    classesResolver(ownerState) {
        return [ownerState.focused && "chipFocused"];
    },
})(
    ({ theme, ownerState }) => css`
        margin: ${theme.spacing(0.5)} ${theme.spacing(0.25)};

        ${ownerState.focused &&
        css`
            background-color: ${theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700]};
        `}
    `,
);

function MultiValue<OptionType extends OptionTypeBase>(props: MultiValueProps<OptionType>) {
    return (
        <MultiValueChip
            tabIndex={-1}
            ownerState={{ focused: props.isFocused }}
            label={props.children}
            onDelete={props.removeProps.onClick}
            deleteIcon={<Clear {...props.removeProps} />}
        />
    );
}

const MenuSlot = createComponentSlot(Paper)<SelectClassKey>({
    componentName: "Select",
    slotName: "paper",
})();

function Menu<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: MenuProps<OptionType, IsMulti>) {
    return <MenuSlot {...props.innerProps}>{props.children}</MenuSlot>;
}

const IndicatorsContainerSlot = createComponentSlot("div")<SelectClassKey>({
    componentName: "Select",
    slotName: "indicatorsContainer",
})(css`
    display: flex;
`);

function IndicatorsContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <IndicatorsContainerSlot>{props.children}</IndicatorsContainerSlot>;
}

const IndicatorSeparatorSlot = createComponentSlot("span")<SelectClassKey>({
    componentName: "Select",
    slotName: "indicatorSeparator",
})(
    ({ theme }) => css`
        width: 1px;
        flex-grow: 1;
        background-color: ${theme.palette.divider};
    `,
);

function IndicatorSeparator<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <IndicatorSeparatorSlot />;
}

const ClearIndicatorSlot = createComponentSlot("div")<SelectClassKey>({
    componentName: "Select",
    slotName: "clearIndicator",
    classesResolver() {
        return ["indicator"];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.grey[500]};
        width: 32px;
        cursor: pointer;
        font-size: 18px;
    `,
);

function ClearIndicator<OptionType extends OptionTypeBase, IsMulti extends boolean>({
    selectProps,
    clearValue,
}: IndicatorProps<OptionType, IsMulti>) {
    const Icon = selectProps.clearIcon ? selectProps.clearIcon : Close;
    return (
        <ClearIndicatorSlot onClick={clearValue}>
            <Icon fontSize="inherit" color="inherit" />
        </ClearIndicatorSlot>
    );
}

const DropdownIndicatorSlot = createComponentSlot("div")<SelectClassKey>({
    componentName: "Select",
    slotName: "dropdownIndicator",
    classesResolver() {
        return ["indicator"];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.grey[500]};
        width: 32px;
        cursor: pointer;
        font-size: 20px;
    `,
);

function DropdownIndicator<OptionType extends OptionTypeBase, IsMulti extends boolean>({ selectProps }: IndicatorProps<OptionType, IsMulti>) {
    const DefaultIcon = selectProps.dropdownIcon ? selectProps.dropdownIcon : ChevronDown;
    const OpenIcon = selectProps.dropdownIconOpen ? selectProps.dropdownIconOpen : ChevronDown;
    const Icon = selectProps.menuIsOpen ? OpenIcon : DefaultIcon;

    return (
        <DropdownIndicatorSlot>
            <Icon fontSize="inherit" color="inherit" />
        </DropdownIndicatorSlot>
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

<<<<<<< HEAD
export interface SelectProps<OptionType extends OptionTypeBase, IsMulti extends boolean = false> {
    selectComponent: React.ComponentType<ReactSelectProps<OptionType, IsMulti>>;
    clearIcon?: SvgIconComponent;
    dropdownIcon?: SvgIconComponent;
    dropdownIconOpen?: SvgIconComponent;
=======
export interface SelectProps<OptionType extends OptionTypeBase> {
    theme: Theme;
    selectComponent: React.ComponentType<ReactSelectProps<OptionType>>;
    clearIcon?: React.ComponentType<SvgIconProps>;
    dropdownIcon?: React.ComponentType<SvgIconProps>;
    dropdownIconOpen?: React.ComponentType<SvgIconProps>;
>>>>>>> main
}

function SelectWrapper<OptionType extends OptionTypeBase, IsMulti extends boolean = false>({
    components: origComponents,
    selectComponent: SelectComponent,
    ...rest
}: SelectProps<OptionType, IsMulti> & ReactSelectProps<OptionType, IsMulti>) {
    const { zIndex } = useTheme();

    return (
        <SelectComponent
            menuPortalTarget={document.body}
            components={{ ...components, ...origComponents }}
            placeholder=""
            styles={{
                menuPortal: (styles) => ({ ...styles, zIndex: zIndex.modal }),
            }}
            {...rest}
        />
    );
}

export function ReactSelect<OptionType extends OptionTypeBase>(props: ReactSelectProps<OptionType>) {
    return <SelectWrapper selectComponent={Select} {...props} />;
}

export function ReactSelectAsync<OptionType extends OptionTypeBase, IsMulti extends boolean = false>(
    props: ReactSelectAsyncProps<OptionType, IsMulti>,
) {
    return <SelectWrapper selectComponent={AsyncSelect} {...props} />;
}

export function ReactSelectCreatable<OptionType extends OptionTypeBase, IsMulti extends boolean>(
    props: ReactSelectCreatableProps<OptionType, IsMulti>,
) {
    return <SelectWrapper selectComponent={CreatableSelect} {...props} />;
}

export function ReactSelectAsyncCreatable<OptionType extends OptionTypeBase, IsMulti extends boolean>(
    props: ReactSelectCreatableProps<OptionType, IsMulti> & ReactSelectAsyncProps<OptionType, IsMulti>,
) {
    return <SelectWrapper selectComponent={AsyncCreatableSelect} {...props} />;
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminSelect: SelectClassKey;
    }

    interface ComponentsPropsList {
        CometAdminSelect: SelectProps<any>;
    }

    interface Components {
        CometAdminSelect?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminSelect"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSelect"];
        };
    }
}
