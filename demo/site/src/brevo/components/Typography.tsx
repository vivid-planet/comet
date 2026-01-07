import { MjmlText } from "@faire/mjml-react";
import { theme } from "@src/brevo/util/theme";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "body" | "headline";

type MjmlTextProps = ComponentProps<typeof MjmlText>;

export interface TypographyProps extends MjmlTextProps {
    variant?: Variant;
    disableBottomSpacing?: boolean;
    children?: ReactNode;
}

type VariantStyle = MjmlTextProps & {
    bottomSpacing: number;
};

export const typographyVariantStyles: Record<Variant, VariantStyle> = {
    headline: {
        fontFamily: "Roboto Condensed, Helvetica, Arial, sans-serif",
        fontWeight: "500",
        bottomSpacing: 15,
        color: theme.colors.text.main,
    },
    body: {
        fontSize: 16,
        lineHeight: "22px",
        bottomSpacing: 15,
        color: theme.colors.text.main,
    },
};

export const Typography = ({ variant = "body", disableBottomSpacing, ...restProps }: TypographyProps) => {
    const { bottomSpacing, ...variantStyle } = typographyVariantStyles[variant];
    const actualBottomSpacing = disableBottomSpacing ? 0 : bottomSpacing;
    return <MjmlText paddingBottom={actualBottomSpacing} {...variantStyle} {...restProps} />;
};
