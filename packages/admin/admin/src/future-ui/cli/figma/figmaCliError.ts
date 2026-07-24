type FigmaCliErrorCode =
    | "auth_missing"
    | "scope_denied"
    | "rate_limited"
    | "figma_error"
    | "component_unknown"
    | "node_missing"
    | "source_incomplete";

export class FigmaCliError extends Error {
    readonly code: FigmaCliErrorCode;

    constructor(code: FigmaCliErrorCode, message: string) {
        super(message);
        this.name = "FigmaCliError";
        this.code = code;
    }
}

export function isFigmaCliError(error: unknown): error is FigmaCliError {
    return error instanceof FigmaCliError;
}

export const exitCode = {
    ok: 0,
    error: 1,
    auth: 3,
    rateLimit: 4,
};

export function exitCodeForError(code: FigmaCliErrorCode): number {
    switch (code) {
        case "auth_missing":
            return exitCode.auth;
        case "rate_limited":
            return exitCode.rateLimit;
        case "scope_denied":
        case "figma_error":
        case "component_unknown":
        case "node_missing":
        case "source_incomplete":
            return exitCode.error;
    }
}
