/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIconComponent } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import DropdownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Chip, ComponentsOverrides, InputBase, MenuItem, Paper, Theme, Typography, useTheme } from "@mui/material";
import { css, styled } from "@mui/material/styles";
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

const NoOptionsMessageText = styled(Typography, {
    name: "CometAdminSelect",
    slot: "noOptionsMessage",
    overridesResolver(_, styles) {
        return [styles.noOptionsMessage];
    },
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

const ControlInput = styled(InputBase, {
    name: "CometAdminSelect",
    slot: "input",
    overridesResolver(_, styles) {
        return [styles.input];
    },
})(css`
    .MuiInputBase-input {
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

type OptionMenuItemProps = {
    focused: boolean;
    selected: boolean;
};

const OptionMenuItem = styled(MenuItem, {
    name: "CometAdminSelect",
    slot: "option",
    overridesResolver({ focused, selected }: OptionMenuItemProps, styles) {
        return [styles.option, focused && styles.optionFocused, selected && styles.optionSelected];
    },
})<OptionMenuItemProps>(
    ({ theme, focused, selected }) => css`
        ${selected &&
        css`
            font-weight: ${theme.typography.fontWeightMedium};
        `}

        ${focused &&
        css`
            background-color: ${theme.palette.action.selected};
        `}
    `,
);

function Option<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: OptionProps<OptionType, IsMulti>) {
    return (
        <OptionMenuItem
            ref={props.innerRef}
            focused={props.isFocused}
            selected={props.isSelected}
            disabled={props.isDisabled}
            // @ts-expect-error The type is not correctly passed through to `MenuItem` when using `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
            component="div"
            {...props.innerProps}
        >
            {props.children}
        </OptionMenuItem>
    );
}

const PlaceholderSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "placeholder",
    overridesResolver(_, styles) {
        return [styles.placeholder];
    },
})(
    ({ theme }) => css`
        color: ${theme.palette.text.disabled};
    `,
);

function Placeholder<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: PlaceholderProps<OptionType, IsMulti>) {
    return <PlaceholderSlot {...props.innerProps}>{props.children}</PlaceholderSlot>;
}

const SingleValueSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "singleValue",
    overridesResolver(_, styles) {
        return [styles.singleValue];
    },
})(css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`);

function SingleValue<OptionType extends OptionTypeBase>(props: SingleValueProps<OptionType>) {
    return <SingleValueSlot {...props.innerProps}>{props.children}</SingleValueSlot>;
}

const ValueContainerSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "valueContainer",
    overridesResolver(_, styles) {
        return [styles.valueContainer];
    },
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

type MultiValueChipProps = {
    focused: boolean;
};

const MultiValueChip = styled(Chip, {
    name: "CometAdminSelect",
    slot: "chip",
    overridesResolver({ focused }: MultiValueChipProps, styles) {
        return [styles.chip, focused && styles.chipFocused];
    },
})<MultiValueChipProps>(
    ({ theme, focused }) => css`
        margin: ${theme.spacing(0.5)} ${theme.spacing(0.25)};

        ${focused &&
        css`
            background-color: ${theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700]};
        `}
    `,
);

function MultiValue<OptionType extends OptionTypeBase>(props: MultiValueProps<OptionType>) {
    return (
        <MultiValueChip
            tabIndex={-1}
            focused={props.isFocused}
            label={props.children}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

const MenuSlot = styled(Paper, {
    name: "CometAdminSelect",
    slot: "paper",
    overridesResolver(_, styles) {
        return [styles.paper];
    },
})(css``);

function Menu<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: MenuProps<OptionType, IsMulti>) {
    return <MenuSlot {...props.innerProps}>{props.children}</MenuSlot>;
}

const IndicatorsContainerSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "indicatorsContainer",
    overridesResolver(_, styles) {
        return [styles.indicatorsContainer];
    },
})(css`
    display: flex;
`);

function IndicatorsContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <IndicatorsContainerSlot>{props.children}</IndicatorsContainerSlot>;
}

const IndicatorSeparatorSlot = styled("span", {
    name: "CometAdminSelect",
    slot: "indicatorSeparator",
    overridesResolver(_, styles) {
        return [styles.indicatorSeparator];
    },
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

const ClearIndicatorSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "clearIndicator",
    overridesResolver(_, styles) {
        return [styles.indicator, styles.clearIndicator];
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
    const Icon = selectProps.clearIcon ? selectProps.clearIcon : ClearIcon;
    return (
        <ClearIndicatorSlot onClick={clearValue}>
            <Icon fontSize="inherit" color="inherit" />
        </ClearIndicatorSlot>
    );
}

const DropdownIndicatorSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "dropdownIndicator",
    overridesResolver(_, styles) {
        return [styles.indicator, styles.dropdownIndicator];
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
    const DefaultIcon = selectProps.dropdownIcon ? selectProps.dropdownIcon : DropdownIcon;
    const OpenIcon = selectProps.dropdownIconOpen ? selectProps.dropdownIconOpen : DropdownIcon;
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

export interface SelectProps<OptionType extends OptionTypeBase, IsMulti extends boolean = false> {
    selectComponent: React.ComponentType<ReactSelectProps<OptionType, IsMulti>>;
    clearIcon?: SvgIconComponent;
    dropdownIcon?: SvgIconComponent;
    dropdownIconOpen?: SvgIconComponent;
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
        CometAdminSelect: Partial<SelectProps<any>>;
    }

    interface Components {
        CometAdminSelect?: {
            defaultProps?: ComponentsPropsList["CometAdminSelect"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSelect"];
        };
    }
}
