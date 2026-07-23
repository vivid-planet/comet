type FigmaErrorCode = "auth_missing" | "scope_denied" | "rate_limited" | "figma_error";

export class FigmaCliError extends Error {
    readonly code: FigmaErrorCode;

    constructor(code: FigmaErrorCode, message: string) {
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

export function exitCodeForError(code: FigmaErrorCode): number {
    switch (code) {
        case "auth_missing":
            return exitCode.auth;
        case "rate_limited":
            return exitCode.rateLimit;
        case "scope_denied":
        case "figma_error":
            return exitCode.error;
    }
}

const FIGMA_FILE_KEY_PATTERN = /\/(?:file|design)\/([^/?#]+)/;

/** The file key from a Figma `/design/{key}/…` or `/file/{key}/…` URL. */
export function parseFigmaFileKey(figmaUrl: string): string {
    const match = figmaUrl.match(FIGMA_FILE_KEY_PATTERN);
    if (!match) {
        throw new FigmaCliError("figma_error", `Could not parse a Figma file key from "${figmaUrl}"`);
    }
    return match[1];
}

/** Fails with `auth_missing` before any request is made when the token is absent. */
export function resolveFigmaToken(): string {
    const token = process.env.FIGMA_TOKEN;
    if (!token) {
        throw new FigmaCliError("auth_missing", "FIGMA_TOKEN environment variable is not set");
    }
    return token;
}

const FIGMA_API_BASE_URL = "https://api.figma.com";
const RATE_LIMIT_STATUS = 429;
const SCOPE_DENIED_STATUS = 403;

/** The subset of a `fetch` response the client depends on, so tests can stub it. */
export interface FigmaResponse {
    ok: boolean;
    status: number;
    headers: { get(name: string): string | null };
    text(): Promise<string>;
}

export type FigmaFetch = (url: string, init: { headers: Record<string, string> }) => Promise<FigmaResponse>;

type WaitFn = (milliseconds: number) => Promise<void>;

export interface FigmaFileClient {
    getFile(): Promise<unknown>;
}

interface FigmaRestClientOptions {
    token: string;
    fileKey: string;
    fetch?: FigmaFetch;
    wait?: WaitFn;
}

const defaultFetch: FigmaFetch = (url, init) => fetch(url, init);

const defaultWait: WaitFn = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractFigmaErrorMessage(body: string): string | null {
    let parsed: unknown;
    try {
        parsed = JSON.parse(body);
    } catch {
        // A non-JSON body (e.g. an HTML error page) carries no message to extract.
        return null;
    }
    if (isRecord(parsed)) {
        if (typeof parsed.err === "string") {
            return parsed.err;
        }
        if (typeof parsed.message === "string") {
            return parsed.message;
        }
    }
    return null;
}

function retryAfterMilliseconds(response: FigmaResponse): number {
    const retryAfterSeconds = Number(response.headers.get("Retry-After"));
    return Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 0;
}

export class FigmaRestClient implements FigmaFileClient {
    private readonly token: string;
    private readonly fileKey: string;
    private readonly fetch: FigmaFetch;
    private readonly wait: WaitFn;

    constructor(options: FigmaRestClientOptions) {
        this.token = options.token;
        this.fileKey = options.fileKey;
        this.fetch = options.fetch ?? defaultFetch;
        this.wait = options.wait ?? defaultWait;
    }

    getFile(): Promise<unknown> {
        return this.request(`/v1/files/${this.fileKey}`);
    }

    private async request(path: string): Promise<unknown> {
        const response = await this.fetchWithRateLimitRetry(`${FIGMA_API_BASE_URL}${path}`);
        const body = await response.text();
        if (response.ok) {
            return JSON.parse(body);
        }
        if (response.status === SCOPE_DENIED_STATUS) {
            throw new FigmaCliError("scope_denied", extractFigmaErrorMessage(body) ?? body);
        }
        throw new FigmaCliError("figma_error", `Figma API request failed with status ${response.status}: ${extractFigmaErrorMessage(body) ?? body}`);
    }

    private async fetchWithRateLimitRetry(url: string): Promise<FigmaResponse> {
        const response = await this.fetchWithToken(url);
        if (response.status !== RATE_LIMIT_STATUS) {
            return response;
        }
        await this.wait(retryAfterMilliseconds(response));
        const retriedResponse = await this.fetchWithToken(url);
        if (retriedResponse.status === RATE_LIMIT_STATUS) {
            throw new FigmaCliError("rate_limited", "Figma API rate limit exceeded (429) after one retry");
        }
        return retriedResponse;
    }

    private fetchWithToken(url: string): Promise<FigmaResponse> {
        return this.fetch(url, { headers: { "X-Figma-Token": this.token } });
    }
}
