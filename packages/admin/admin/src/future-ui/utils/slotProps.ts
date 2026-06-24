import { mergeProps } from "@base-ui/react/merge-props";
import type { ComponentPropsWithRef, ElementType } from "react";

export type SlotPropsValue<OwnerState, T extends ElementType> = ComponentPropsWithRef<T> | ((ownerState: OwnerState) => ComponentPropsWithRef<T>);

function isOwnerStateFunction<OwnerState, T extends ElementType>(
    value: SlotPropsValue<OwnerState, T> | undefined,
): value is (ownerState: OwnerState) => ComponentPropsWithRef<T> {
    return typeof value === "function";
}

/**
 * Resolves a slot's `slotProps` value — calling it with `ownerState` when it's a
 * function — then merges it with the slot's own props via `mergeProps`.
 */
export function resolveSlotProps<OwnerState, T extends ElementType>(
    ownProps: ComponentPropsWithRef<T>,
    value: SlotPropsValue<OwnerState, T> | undefined,
    ownerState: OwnerState,
) {
    const consumerProps = isOwnerStateFunction(value) ? value(ownerState) : value;

    return mergeProps<T>(ownProps, consumerProps);
}
