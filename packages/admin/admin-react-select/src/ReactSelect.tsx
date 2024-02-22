/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIconComponent } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import DropdownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Chip, ComponentsOverrides, Theme, useTheme } from "@mui/material";
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

import {
    ClearIndicatorSlot,
    ControlInput,
    DropdownIndicatorSlot,
    IndicatorsContainerSlot,
    IndicatorSeparatorSlot,
    NoOptionsMessageSlot,
    OptionSlot,
    PaperSlot,
    PlaceholderSlot,
    SelectClassKey,
    SingleValueSlot,
    ValueContainerSlot,
} from "./ReactSelect.styles";

function NoOptionsMessage<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: NoticeProps<OptionType, IsMulti>) {
    return <NoOptionsMessageSlot {...props.innerProps}>{props.children}</NoOptionsMessageSlot>;
}

function inputComponent({ inputRef, ...props }: any) {
    return <div ref={inputRef} {...props} />;
}

//TODO Write changelog

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

function Option<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: OptionProps<OptionType, IsMulti>) {
    return (
        <OptionSlot
            ref={props.innerRef}
            isFocused={props.isFocused}
            selected={props.isSelected}
            disabled={props.isDisabled}
            // @ts-expect-error TODO
            component="div"
            {...props.innerProps}
        >
            {props.children}
        </OptionSlot>
    );
}

function Placeholder<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: PlaceholderProps<OptionType, IsMulti>) {
    return <PlaceholderSlot {...props.innerProps}>{props.children}</PlaceholderSlot>;
}

function SingleValue<OptionType extends OptionTypeBase>(props: SingleValueProps<OptionType>) {
    return <SingleValueSlot {...props.innerProps}>{props.children}</SingleValueSlot>;
}

function ValueContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ValueContainerProps<OptionType, IsMulti>) {
    return <ValueContainerSlot>{props.children}</ValueContainerSlot>;
}

//TODO apply styled components
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
    return <PaperSlot {...props.innerProps}>{props.children}</PaperSlot>;
}

function IndicatorsContainer<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <IndicatorsContainerSlot>{props.children}</IndicatorsContainerSlot>;
}

//TODO check if slots are applied correctly
function IndicatorSeparator<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: IndicatorContainerProps<OptionType, IsMulti>) {
    return <IndicatorSeparatorSlot />;
}

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

export interface SelectProps<OptionType extends OptionTypeBase> {
    theme: Theme;
    selectComponent: React.ComponentType<ReactSelectProps<OptionType>>;
    clearIcon?: SvgIconComponent;
    dropdownIcon?: SvgIconComponent;
    dropdownIconOpen?: SvgIconComponent;
}

function SelectWrapper<OptionType extends OptionTypeBase>({
    theme,
    components: origComponents,
    selectComponent: SelectComponent,
    ...rest
}: SelectProps<OptionType> & ReactSelectProps<OptionType>) {
    return <SelectComponent menuPortalTarget={document.body} components={{ ...components, ...origComponents }} placeholder="" {...rest} />;
}

const useReactSelectStyles = () => {
    const { zIndex } = useTheme();
    return {
        menuPortal: (styles: any) => ({ ...styles, zIndex: zIndex.modal }),
    };
};

export function ReactSelect<OptionType extends OptionTypeBase>(props: ReactSelectProps<OptionType>) {
    const reactSelectStyles = useReactSelectStyles();
    // @ts-expect-error TODO
    return <SelectWrapper selectComponent={Select} {...props} styles={{ ...reactSelectStyles }} />;
}

export function ReactSelectAsync<OptionType extends OptionTypeBase, IsMulti extends boolean>(props: ReactSelectAsyncProps<OptionType, IsMulti>) {
    const reactSelectStyles = useReactSelectStyles();
    // @ts-expect-error TODO
    return <SelectWrapper selectComponent={AsyncSelect} {...props} styles={{ ...reactSelectStyles }} />;
}

export function ReactSelectCreatable<OptionType extends OptionTypeBase, IsMulti extends boolean>(
    props: ReactSelectCreatableProps<OptionType, IsMulti>,
) {
    const reactSelectStyles = useReactSelectStyles();
    // @ts-expect-error TODO
    return <SelectWrapper selectComponent={CreatableSelect} {...props} styles={{ ...reactSelectStyles }} />;
}

export function ReactSelectAsyncCreatable<OptionType extends OptionTypeBase, IsMulti extends boolean>(
    props: ReactSelectCreatableProps<OptionType, IsMulti> & ReactSelectAsyncProps<OptionType, IsMulti>,
) {
    const reactSelectStyles = useReactSelectStyles();
    // @ts-expect-error TODO
    return <SelectWrapper selectComponent={AsyncCreatableSelect} {...props} styles={{ ...reactSelectStyles }} />;
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
