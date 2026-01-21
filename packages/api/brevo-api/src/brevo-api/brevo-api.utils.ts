import { type ErrorModel } from "@getbrevo/brevo";
import axios, { type AxiosError } from "axios";

type AxiosErrorWithResponse<T = unknown> = AxiosError<T> & { response: NonNullable<AxiosError<T>["response"]> };

export function isErrorFromBrevo(error: unknown): error is AxiosErrorWithResponse<ErrorModel> {
    return axios.isAxiosError(error) && error.response !== undefined && "code" in error.response.data && "message" in error.response.data;
}

export function handleBrevoError(error: unknown): never {
    if (isErrorFromBrevo(error)) {
        throw new Error(error.response.data.message);
    } else {
        throw error;
    }
}
