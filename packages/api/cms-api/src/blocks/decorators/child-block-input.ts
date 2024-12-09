import { Transform } from "class-transformer";
import { ValidateNested } from "class-validator";

import { Block, isBlockInputInterface } from "../block";
import { BlockField } from "./field";

interface ChildBlockInputOptions {
    /**
     * @deprecated Nullable child blocks are not correctly supported in
     * the Admin, for instance, in `createCompositeBlock`. Save a
     * block's default values instead.
     */
    nullable?: boolean;
    disableValidateNested?: boolean; // Useful when a custom validation strategy is needed
}
export function ChildBlockInput(block: Block, options?: ChildBlockInputOptions): PropertyDecorator {
    const nullable = options?.nullable ? true : false;
    const disableValidateNested = options?.disableValidateNested ? true : false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, key: string | symbol) {
        if (!disableValidateNested) {
            ValidateNested()(target, key); // by default valdidate all child blocks
        }
        BlockField({ type: "block", block, nullable })(target, key);
        Transform(
            ({ value }) =>
                isBlockInputInterface(value)
                    ? value
                    : nullable && (value === undefined || value === null)
                    ? undefined
                    : block.blockInputFactory(value),
            {
                toClassOnly: true,
            },
        )(target, key as string);
    };
}
