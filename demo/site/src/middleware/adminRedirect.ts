import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

export function withAdminRedirectMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        if (request.nextUrl.pathname === "/admin" && process.env.ADMIN_URL) {
            return NextResponse.redirect(new URL(process.env.ADMIN_URL));
        }
        return middleware(request);
    };
}
