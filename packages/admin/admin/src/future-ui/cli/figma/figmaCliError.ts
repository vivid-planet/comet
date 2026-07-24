export type FigmaCliErrorCode = "auth_missing" | "scope_denied" | "rate_limited" | "figma_error" | "component_unknown" | "node_missing";

export class FigmaCliError extends Error {
    readonly code: FigmaCliErrorCode;

    constructor(code: FigmaCliErrorCode, message: string) {
        super(message);
        this.name = "FigmaCliError";
        this.code = code;
    }
}
