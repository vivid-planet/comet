import { InputWithPopper, ThemedComponentBaseProps } from "@comet/admin";
import { Box, ButtonBase, IconButton, InputAdornment as MuiInputAdornment, Typography } from "@mui/material";
import { css, styled, Theme } from "@mui/material/styles";
import { HexColorPicker as HexColorPickerBase, RgbaStringColorPicker as RgbaStringColorPickerBase } from "react-colorful";

export type ColorPickerClassKey =
    | "root"
    | "inputAdornment"
    | "popperRoot"
    | "popperSection"
    | "header"
    | "headerTitleText"
    | "headerCloseButton"
    | "colorPickerWrapper"
    | "colorPalette"
    | "colorPaletteItem"
    | "footer"
    | "footerClearButton"
    | "preview"
    | "previewIndicator"
    | "previewIndicatorColor"
    | "previewIndicatorEmpty"
    | "previewIndicatorInvalid"
    | "hexColorPicker"
    | "rgbaStringColorPicker";

export type SlotProps = ThemedComponentBaseProps<{
    root: typeof InputWithPopper;
    inputAdornment: typeof InputAdornment;
    popperRoot: "div";
    header: "div";
    headerTitleText: typeof Typography;
    headerCloseButton: typeof IconButton;
    colorPickerWrapper: "div";
    colorPalette: "div";
    colorPaletteItem: typeof Box;
    footer: "div";
    footerClearButton: typeof ButtonBase;
    preview: "div";
    previewIndicator: "div";
    previewIndicatorColor: "div";
    previewIndicatorEmpty: "div";
    previewIndicatorInvalid: "div";
    hexColorPicker: typeof HexColorPickerBase;
    rgbaStringColorPicker: typeof RgbaStringColorPickerBase;
}>["slotProps"];

const getPopperSectionStyles = (theme: Theme) => css`
    padding: ${theme.spacing(3)};

    &:not(:last-child) {
        border-bottom: thin solid ${theme.palette.grey[100]};
    }
`;

export const Root = styled(InputWithPopper, {
    name: "CometAdminColorPicker",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

export const InputAdornment = styled(MuiInputAdornment, {
    name: "CometAdminColorPicker",
    slot: "inputAdornment",
    overridesResolver(_, styles) {
        return [styles.inputAdornment];
    },
})();

export const PopperRoot = styled("div", {
    name: "CometAdminColorPicker",
    slot: "popperRoot",
    overridesResolver(_, styles) {
        return [styles.popperRoot];
    },
})(css`
    width: 300px;
`);

export const Header = styled("div", {
    name: "CometAdminColorPicker",
    slot: "header",
    overridesResolver(_, styles) {
        return [styles.header, styles.popperSection];
    },
})(
    ({ theme }) => css`
        ${getPopperSectionStyles(theme)}
        position: relative;
        padding-right: 40px;
    `,
);

export const HeaderTitleText = styled(Typography, {
    name: "CometAdminColorPicker",
    slot: "headerTitleText",
    overridesResolver(_, styles) {
        return [styles.headerTitleText];
    },
})(
    ({ theme }) => css`
        font-weight: ${theme.typography.fontWeightBold};
    `,
);

export const HeaderCloseButton = styled(IconButton, {
    name: "CometAdminColorPicker",
    slot: "headerCloseButton",
    overridesResolver(_, styles) {
        return [styles.headerCloseButton];
    },
})(
    ({ theme }) => css`
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: ${theme.spacing(2)};
    `,
);

export const ColorPickerWrapper = styled("div", {
    name: "CometAdminColorPicker",
    slot: "colorPickerWrapper",
    overridesResolver(_, styles) {
        return [styles.colorPickerWrapper, styles.popperSection];
    },
})(
    ({ theme }) => css`
        ${getPopperSectionStyles(theme)}

        .react-colorful {
            width: 100%;
            height: auto;

            &__pointer {
                width: 30px;
                height: 30px;
            }

            &__saturation,
            &__hue,
            &__alpha {
                border-radius: 0;

                &:not(:last-child) {
                    margin-bottom: ${theme.spacing(3)};
                }
            }

            &__saturation {
                border-bottom: none;
                height: 270px;
            }

            &__hue,
            &__alpha {
                height: 20px;
            }

            &__alpha-gradient {
                box-shadow: none;
            }
        }
    `,
);

export const ColorPalette = styled("div", {
    name: "CometAdminColorPicker",
    slot: "colorPalette",
    overridesResolver(_, styles) {
        return [styles.colorPalette, styles.popperSection];
    },
})(
    ({ theme }) => css`
        ${getPopperSectionStyles(theme)}
        display: flex;
        flex-wrap: wrap;
        gap: ${theme.spacing(1)};
    `,
);

type ColorPaletteItemProps = {
    colorValue: string;
};

export const ColorPaletteItem = styled(Box, {
    name: "CometAdminColorPicker",
    slot: "colorPaletteItem",
    shouldForwardProp: (prop) => prop !== "color",
    overridesResolver(_, styles) {
        return [styles.colorPaletteItem];
    },
})<ColorPaletteItemProps>(
    ({ theme, colorValue }) => css`
        cursor: pointer;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        border: thin solid ${theme.palette.grey[100]};
        border-radius: ${theme.shape.borderRadius};
        box-sizing: border-box;
        background-color: ${colorValue};
    `,
);

export const Footer = styled("div", {
    name: "CometAdminColorPicker",
    slot: "footer",
    overridesResolver(_, styles) {
        return [styles.footer, styles.popperSection];
    },
})(
    ({ theme }) => css`
        ${getPopperSectionStyles(theme)}
        padding: ${theme.spacing(1)};
    `,
);

export const FooterClearButton = styled(ButtonBase, {
    name: "CometAdminColorPicker",
    slot: "footerClearButton",
    overridesResolver(_, styles) {
        return [styles.footerClearButton];
    },
})(
    ({ theme }) => css`
        padding: ${theme.spacing(2)};
        border-radius: ${theme.shape.borderRadius};
    `,
);

export const Preview = styled("div", {
    name: "CometAdminColorPicker",
    slot: "preview",
    overridesResolver(_, styles) {
        return [styles.preview];
    },
})(css`
    position: relative;
    overflow: hidden;
    width: 24px;
    height: 24px;
`);

type PreviewIndicatorProps = PreviewIndicatorEmptyOrInvalidProps | PreviewIndicatorColorProps;

export type PreviewIndicatorEmptyOrInvalidProps = {
    type: "empty" | "invalid";
};

export type PreviewIndicatorColorProps = {
    type: "color";
    color: string;
};

export const PreviewIndicator = styled("div", {
    name: "CometAdminColorPicker",
    slot: "previewIndicator",
    shouldForwardProp: (prop) => prop !== "type" && prop !== "color",
    overridesResolver({ type }: PreviewIndicatorProps, styles) {
        return [
            styles.previewIndicator,
            type === "color" && styles.previewIndicatorColor,
            type === "empty" && styles.previewIndicatorEmpty,
            type === "invalid" && styles.previewIndicatorInvalid,
        ];
    },
})<PreviewIndicatorProps>(
    ({ type, color, theme }) => css`
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border: thin solid ${theme.palette.divider};
        border-radius: ${theme.shape.borderRadius};

        ${type === "color" &&
        css`
            background-color: ${color};
        `}

        ${type === "empty" &&
        css`
            display: flex;
            align-items: center;
            justify-content: center;

            &:before {
                content: "";
                display: block;
                background-color: #f62929;
                width: 1px;
                height: calc(100% - 4px);
                transform: rotate(45deg);
            }
        `}

        ${type === "invalid" &&
        css`
            font-size: 16px;
            line-height: 24px;
            font-weight: ${theme.typography.fontWeightBold};
            color: ${theme.palette.text.secondary};
            text-align: center;
        `}
    `,
);

export const HexColorPicker = styled(HexColorPickerBase, {
    name: "CometAdminColorPicker",
    slot: "hexColorPicker",
    overridesResolver(_, styles) {
        return [styles.hexColorPicker];
    },
})();

export const RgbaStringColorPicker = styled(RgbaStringColorPickerBase, {
    name: "CometAdminColorPicker",
    slot: "rgbaStringColorPicker",
    overridesResolver(_, styles) {
        return [styles.rgbaStringColorPicker];
    },
})();
