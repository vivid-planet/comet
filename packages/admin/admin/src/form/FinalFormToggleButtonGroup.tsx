import { ButtonBase, Typography, type TypographyProps } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import { type ReactNode } from "react";
import { type FieldRenderProps } from "react-final-form";

export type FinalFormToggleButtonGroupProps<FieldValue> = {
    options: Array<{ value: FieldValue; label: ReactNode }>;
    optionsPerRow?: number;
};

type FinalFormToggleButtonGroupInternalProps<FieldValue> = FieldRenderProps<FieldValue, HTMLDivElement>;

/**
 * Final Form-compatible ToggleButtonGroup component.
 *
 * @see {@link ToggleButtonGroupField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export function FinalFormToggleButtonGroup<FieldValue = unknown>({
    input: { value, onChange },
    options,
    optionsPerRow,
}: FinalFormToggleButtonGroupProps<FieldValue> & FinalFormToggleButtonGroupInternalProps<FieldValue>) {
    return (
        <Root $optionsPerRow={optionsPerRow}>
            {options.map(({ value: optionValue, label }, index) => (
                <Button key={index} $selected={value === optionValue} onClick={() => onChange(optionValue)} focusRipple>
                    <Label component="span" variant="body2">
                        {label}
                    </Label>
                </Button>
            ))}
        </Root>
    );
}

const Label = styled(Typography)<{ component: TypographyProps["component"] }>`
    display: flex;
    align-items: center;
`;

const Root = styled("div", { shouldForwardProp: (prop) => prop !== "$optionsPerRow" })<{ $optionsPerRow?: number }>`
    display: inline-flex;
    min-height: 40px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background-color: ${({ theme }) => theme.palette.divider};
    border-radius: 2px;
    overflow: hidden;
    gap: 1px;

    ${({ $optionsPerRow }) =>
        $optionsPerRow &&
        css`
            display: inline-grid;
            grid-template-columns: repeat(${$optionsPerRow}, 1fr);
        `}
`;

const Button = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== "$selected" })<{ $selected?: boolean }>`
    padding-left: ${({ theme }) => theme.spacing(3)};
    padding-right: ${({ theme }) => theme.spacing(3)};
    padding-top: 9px;
    padding-bottom: 9px;
    background-color: ${({ theme }) => theme.palette.background.paper};

    :hover {
        background-color: ${({ theme }) => theme.palette.grey[50]};
    }

    ${({ $selected, theme }) =>
        $selected &&
        css`
            color: ${theme.palette.primary.main};

            :before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 2px;
                background-color: ${theme.palette.primary.main};
            }
        `}
`;
