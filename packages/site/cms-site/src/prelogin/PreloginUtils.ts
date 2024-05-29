import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { GraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { getJwtSigningKey, Scope, validateScope } from "../util/ScopeUtils";

export async function preloginRoute(request: NextRequest, graphQLFetch: GraphQLFetch) {
    const secret = new TextEncoder().encode(getJwtSigningKey());

    // Validate submitted jwt
    const tokenParam = request.nextUrl.searchParams.get("token");
    if (!tokenParam) {
        throw new Error("Missing token parameter");
    }
    const jwt = await jwtVerify<{ scope: Scope; redirectUri: string; callbackUrl: string }>(tokenParam, secret);

    // Validate submitted scope
    const scope = jwt.payload.scope;
    if (!(await validateScope(request, graphQLFetch, "prelogin", scope))) {
        return new Response("Prelogin is not allowed", {
            status: 403,
        });
    }

    // Create jwt and redirect back
    const token = await new SignJWT({
        scope,
        callbackUrl: jwt.payload.callbackUrl,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("10 sec")
        .sign(secret);
    return redirect(`${jwt.payload.redirectUri}?token=${token}`);
}
