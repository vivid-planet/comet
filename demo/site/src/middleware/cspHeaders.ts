import { NextRequest } from "next/server";

import { CustomMiddleware } from "./chain";

type ContentSecurityPolicyDirective = {
    directive: string;
    values: string[];
};

const contentSecurityPolicyDirectives: ContentSecurityPolicyDirective[] = [
    { directive: "default-src", values: ["'none'"] }, // Restrict any content not explicitly allowed
    { directive: "style-src-elem", values: ["'self'", "'unsafe-inline'"] },
    { directive: "script-src-elem", values: ["'self'", "'unsafe-inline'"] },
    { directive: "img-src", values: ["'self'", "data:", process.env.API_URL?.replace("/api", "") ?? ""] },
    { directive: "style-src-attr", values: ["'unsafe-inline'"] },
    { directive: "font-src", values: ["'self'", "data:"] },
    { directive: "frame-ancestors", values: [process.env.ADMIN_URL ?? "https:"] },
    { directive: "frame-src", values: ["https://www.youtube-nocookie.com/", "https://player.vimeo.com/"] },
];

if (process.env.NODE_ENV === "development") {
    contentSecurityPolicyDirectives.push({ directive: "connect-src", values: ["ws:", process.env.API_URL ?? "localhost:"] }); // API URL is needed to lead news feed in local development
    contentSecurityPolicyDirectives.push({ directive: "script-src", values: ["'unsafe-eval'"] });
} else {
    contentSecurityPolicyDirectives.push({ directive: "upgrade-insecure-requests", values: [] });
}

const contentSecurityPolicy = contentSecurityPolicyDirectives.map((directive) => `${directive.directive} ${directive.values.join(" ")}`).join("; ");

export function withCspHeadersMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const response = await middleware(request);

        response.headers.set("Content-Security-Policy", contentSecurityPolicy);

        if (process.env.ADMIN_URL) {
            response.headers.set("Access-Control-Allow-Origin", process.env.ADMIN_URL);
        }
        return response;
    };
}
