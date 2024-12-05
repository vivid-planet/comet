import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withRobotsTxtMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        if (request.nextUrl.pathname === "/robots.txt") {
            // don't apply any other middlewares
            return NextResponse.next();
        }
        return middleware(request);
    };
}
