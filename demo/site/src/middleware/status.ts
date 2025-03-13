import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

export function withStatusMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        if (request.nextUrl.pathname === "/api/status") {
            return NextResponse.json({ status: "OK" });
        }
        return middleware(request);
    };
}
