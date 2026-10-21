import { mergeProps } from "@base-ui/react/merge-props";
import type { CSSProperties, ElementType } from "react";

type SlotPropsObject<PartProps> = Omit<PartProps, "className" | "style"> & {
    className?: string;
    style?: CSSProperties;
};

/**
 * Customizes one of a component's inner parts, its "slots": the props for the part's element, or a function
 * of the component's owner state that returns them.
 *
 * The props are merged with the part's own: `className` is added to the part's classes, `style` is merged,
 * event handlers run before the part's own, and any other prop replaces the part's own. `render` replaces
 * the part's element, for example `{ render: <strong /> }`.
 *
 * @experimental
 */
export type SlotProps<PartProps, OwnerState> = SlotPropsObject<PartProps> | ((ownerState: OwnerState) => SlotPropsObject<PartProps>);

function isOwnerStateFunction<PartProps, OwnerState>(
    slotProps: SlotProps<PartProps, OwnerState> | undefined,
): slotProps is (ownerState: OwnerState) => SlotPropsObject<PartProps> {
    return typeof slotProps === "function";
}

interface ResolveSlotPropsOptions<PartProps, OwnerState> {
    ownProps: Partial<PartProps>;
    slotProps: SlotProps<PartProps, OwnerState> | undefined;
    ownerState: OwnerState;
}

/**
 * Merges the props a consumer passes for a slot with the part's own props.
 */
export function resolveSlotProps<PartProps extends object, OwnerState>({
    ownProps,
    slotProps,
    ownerState,
}: ResolveSlotPropsOptions<PartProps, OwnerState>): PartProps {
    const consumerProps = isOwnerStateFunction(slotProps) ? slotProps(ownerState) : slotProps;

    return mergeProps<ElementType>(ownProps, consumerProps) as PartProps;
}
