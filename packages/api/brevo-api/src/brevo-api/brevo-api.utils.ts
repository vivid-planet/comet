import { type ErrorModel } from "@getbrevo/brevo";
import * as http from "http";

export function isErrorFromBrevo(error: unknown): error is { response: http.IncomingMessage; body: ErrorModel } {
    return (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        error.response instanceof http.IncomingMessage &&
        "body" in error &&
        typeof error.body === "object" &&
        error.body !== null &&
        "code" in error.body &&
        typeof error.body.code === "string" &&
        "message" in error.body &&
        typeof error.body.message === "string"
    );
}

export function handleBrevoError(error: unknown): never {
    if (isErrorFromBrevo(error)) {
        throw new Error(error.body.message);
    } else {
        throw error;
    }
}
