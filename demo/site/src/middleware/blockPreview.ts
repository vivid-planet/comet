import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withBlockPreviewMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        if (request.nextUrl.pathname.startsWith("/block-preview/")) {
            // don't apply any other middlewares
            return NextResponse.next();
        }
        return middleware(request);
    };
}
