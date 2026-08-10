import { FigmaCliError } from "./figmaCliError.js";

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
const DEPTH_INCLUDING_VARIANT_PROPERTIES = 1;

export interface FigmaFileClient {
    getFile(): Promise<unknown>;
}

interface FigmaRestClientOptions {
    token: string;
    fileKey: string;
}

function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

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

function retryAfterMilliseconds(response: Response): number {
    const retryAfterSeconds = Number(response.headers.get("Retry-After"));
    return Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 0;
}

export class FigmaRestClient implements FigmaFileClient {
    private readonly token: string;
    private readonly fileKey: string;

    constructor(options: FigmaRestClientOptions) {
        this.token = options.token;
        this.fileKey = options.fileKey;
    }

    getFile(): Promise<unknown> {
        return this.request(`/v1/files/${this.fileKey}`);
    }

    getFileNodes(nodeId: string): Promise<unknown> {
        return this.request(`/v1/files/${this.fileKey}/nodes?ids=${encodeURIComponent(nodeId)}&depth=${DEPTH_INCLUDING_VARIANT_PROPERTIES}`);
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

    private async fetchWithRateLimitRetry(url: string): Promise<Response> {
        const response = await this.fetchWithToken(url);
        if (response.status !== RATE_LIMIT_STATUS) {
            return response;
        }
        await wait(retryAfterMilliseconds(response));
        const retriedResponse = await this.fetchWithToken(url);
        if (retriedResponse.status === RATE_LIMIT_STATUS) {
            throw new FigmaCliError("rate_limited", "Figma API rate limit exceeded (429) after one retry");
        }
        return retriedResponse;
    }

    private fetchWithToken(url: string): Promise<Response> {
        return fetch(url, { headers: { "X-Figma-Token": this.token } });
    }
}
