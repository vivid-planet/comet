import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { useId } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import Select from "react-select";

import { FieldContainer, type FieldContainerFieldProps } from "./FieldContainer";
import styles from "./SelectField.module.scss";

type Option = { value: string; label: string };

type SelectFieldProps<TFieldValues extends FieldValues> = Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> &
    Omit<FieldContainerFieldProps, "helperText"> & {
        options: Array<Option>;
        placeholder?: string;
    };

export const SelectField = <TFieldValues extends FieldValues>({
    label,
    name,
    control,
    rules,
    options,
    placeholder,
}: SelectFieldProps<TFieldValues>) => {
    const id = useId();
    const required = !!rules?.required;

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => {
                const selectedOption = options.find((o) => o.value === field.value) ?? null;

                return (
                    <FieldContainer required={required} label={label} errorText={fieldState.error?.message} htmlFor={id}>
                        <Select<Option>
                            unstyled
                            isSearchable={false}
                            styles={{ control: (base) => ({ ...base, outline: undefined }) }}
                            inputId={id}
                            options={options}
                            value={selectedOption}
                            onChange={(option) => field.onChange(option?.value ?? "")}
                            onBlur={field.onBlur}
                            placeholder={placeholder ?? <FormattedMessage id="selectField.placeholder" defaultMessage="Select an option" />}
                            components={{
                                DropdownIndicator: ({ selectProps }) => (
                                    <SvgUse
                                        href="/assets/icons/chevron-down.svg#root"
                                        width={16}
                                        height={16}
                                        className={clsx(styles.chevron, selectProps.menuIsOpen && styles["chevron--open"])}
                                    />
                                ),
                                IndicatorSeparator: null,
                            }}
                            classNames={{
                                container: () => styles.container,
                                control: () => clsx(styles.control, fieldState.error && styles["control--error"]),
                                placeholder: () => styles.placeholder,
                                singleValue: () => styles.singleValue,
                                menu: () => styles.menu,
                                menuList: () => styles.menuList,
                                option: ({ isSelected, isFocused }) =>
                                    clsx(
                                        styles.option,
                                        isSelected && styles["option--selected"],
                                        isFocused && !isSelected && styles["option--focused"],
                                    ),
                            }}
                        />
                    </FieldContainer>
                );
            }}
        />
    );
};
