import { z } from "zod";

// Accept any object cell value (e.g. draft-js `{ draftContent }` or TipTap `{ tipTapContent }`);
// the injected rich text block's `output2State` interprets the payload. Primitives and null are rejected.
export const rteSchema = z.record(z.string(), z.unknown());
