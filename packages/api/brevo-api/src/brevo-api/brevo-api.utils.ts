import { type ErrorModel } from "@getbrevo/brevo";

interface BrevoError {
    response: {
        data: ErrorModel;
        status: number;
    };
    status: number;
}

export function isErrorFromBrevo(error: unknown): error is BrevoError {
    if (typeof error !== "object" || error === null) return false;
    const err = error as Record<string, unknown>;
    if (typeof err.response !== "object" || err.response === null) return false;
    const response = err.response as Record<string, unknown>;
    if (typeof response.data !== "object" || response.data === null) return false;
    const data = response.data as Record<string, unknown>;
    return "code" in data && "message" in data;
}

export function handleBrevoError(error: unknown): never {
    if (isErrorFromBrevo(error)) {
        throw new Error(error.response.data.message);
    } else {
        throw error;
    }
}
