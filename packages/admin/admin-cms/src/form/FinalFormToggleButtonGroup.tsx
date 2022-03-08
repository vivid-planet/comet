import { neutrals } from "@comet/admin-theme";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import styled, { css } from "styled-components";

interface Props<FieldValue> extends FieldRenderProps<FieldValue, HTMLDivElement> {
    options: Array<{ value: FieldValue; icon: React.ReactNode }>;
    optionsPerRow?: number;
}

export function FinalFormToggleButtonGroup<FieldValue = unknown>({
    input: { value, onChange },
    options,
    optionsPerRow,
}: Props<FieldValue>): React.ReactElement {
    return (
        <StyledToggleButtonGroup
            exclusive
            value={value}
            onChange={(event, value: FieldValue | null) => {
                if (value === null) {
                    return;
                }

                onChange(value);
            }}
            $optionsPerRow={optionsPerRow}
        >
            {options.map(({ value, icon }, index) => (
                <StyledToggleButton key={index} value={value} $optionsPerRow={optionsPerRow}>
                    {icon}
                </StyledToggleButton>
            ))}
        </StyledToggleButtonGroup>
    );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ $optionsPerRow?: number }>`
    ${({ $optionsPerRow }) =>
        $optionsPerRow &&
        css`
            display: inline-grid;
            grid-template-columns: repeat(${$optionsPerRow}, 1fr);
        `}
`;

const StyledToggleButton = styled(ToggleButton)<{ $optionsPerRow?: number }>`
    ${({ $optionsPerRow }) =>
        $optionsPerRow &&
        css`
            && {
                margin-left: 0;
                border-radius: 0;
                border-top: none;
                border-right: none;
                border-bottom: 1px solid ${neutrals[100]};
                border-left: 1px solid ${neutrals[100]};

                // first row
                &:nth-child(-n + ${$optionsPerRow}) {
                    border-top: 1px solid ${neutrals[100]};
                }

                // last column
                &:nth-child(${$optionsPerRow}n) {
                    border-right: 1px solid ${neutrals[100]};
                }

                &:first-child {
                    border-top-left-radius: 2px;
                }

                &:nth-child(${$optionsPerRow}) {
                    border-top-right-radius: 2px;
                }

                &:nth-last-child(${$optionsPerRow}) {
                    border-bottom-left-radius: 2px;
                }

                &:last-child {
                    border-bottom-right-radius: 2px;
                }
            }
        `}
`;
