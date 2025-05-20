import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

export function withRobotsMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        // robots.txt is always allowed
        if (request.nextUrl.pathname === "/robots.txt") {
            // don't apply any other middlewares
            return NextResponse.next();
        }
        return middleware(request);
    };
}
