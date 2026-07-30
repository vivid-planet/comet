import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

/**
 * SVG element ids (gradients, masks, clip paths) are document-global. Generating a unique id per component
 * instance prevents multiple instances of the same icon from referencing each other's defs.
 *
 * React's `useId` isn't used here because this package still supports React 17.
 */
export function useUniqueId(prefix: string) {
    return useConstant(() => `${prefix}-${uuid()}`);
}
