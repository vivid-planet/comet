import type { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from "react";

type WidgetVariant = "primary" | "secondary";

interface WidgetLabelProps {
    /**
     * Where the widget places its label.
     *
     * @defaultValue `"top"`
     */
    labelPlacement?: "top" | "bottom";
}

export interface WidgetProps extends Omit<ComponentPropsWithoutRef<"div">, "className">, WidgetLabelProps {
    /** The widget's caption. */
    label: string;
    /**
     * Visual style.
     *
     * @defaultValue `"primary"`
     */
    variant?: WidgetVariant;
    /**
     * Prevents interaction with the widget.
     *
     * @defaultValue `false`
     */
    disabled?: boolean;
    /** Replaces the widget's content with a progress indicator. */
    loading?: boolean;
    /**
     * The semantic element to render, overriding the variant's default.
     *
     * @defaultValue The variant's default element
     */
    element?: "article" | "section";
    /** How many items the widget summarizes. */
    count?: number;
    /** The icon to render before the label. */
    startIcon?: ReactNode;
    /** Added alongside the component's own classes. */
    className?: string;
    /** Sets which element a named inner part renders as. */
    slots?: { startIcon?: ElementType };
    /** Props for each slot, merged with the slot's own props rather than replacing them. */
    slotProps?: { startIcon?: ComponentPropsWithoutRef<"span"> };
    /** Ref forwarded to the root element. */
    ref?: Ref<HTMLDivElement>;
}

/** A component standing in for a real one, declaring every kind of prop a description has to cover. */
export function Widget({ label, children, variant = "primary", disabled = false, loading = false }: WidgetProps) {
    return (
        <div data-variant={variant} data-disabled={disabled} data-loading={loading}>
            {label}
            {children}
        </div>
    );
}
