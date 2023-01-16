import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

function getEncodedJwtFromHeaders(headers: IncomingMessage["headers"]) {
    const header = headers["authorization"];
    if (header) {
        const matches = header.match(/(\S+)\s+(\S+)/);
        if (matches && matches[1] && matches[2] && matches[1] === "Bearer") {
            return matches[2];
        }
    }
}
async function getPublicKeyFromJwks(encodedJWT: string) {
    if (!process.env.IDP_JWKS_URI) {
        throw new Error("IDP_JWKS_URI must be provided");
    }
    const client = jwksClient({
        jwksUri: process.env.IDP_JWKS_URI,
    });
    let decodedJWT;
    try {
        decodedJWT = jwt.decode(encodedJWT, { complete: true });
    } catch (e) {
        return;
    }
    if (decodedJWT) {
        const key = await client.getSigningKey(decodedJWT.header.kid);
        return key.getPublicKey();
    }
}

function verifyJwt(encodedJWT: string, publicKey: string) {
    if (!publicKey) return;
    try {
        return jwt.verify(encodedJWT, publicKey, { ignoreExpiration: true }); // https://github.com/oauth2-proxy/oauth2-proxy/issues/1836
    } catch (e) {
        return;
    }
}

export async function getAuthedUser(req: IncomingMessage) {
    const encodedJWT = getEncodedJwtFromHeaders(req.headers);
    if (!encodedJWT) return;
    const publicKey = await getPublicKeyFromJwks(encodedJWT);
    if (!publicKey) return;
    return verifyJwt(encodedJWT, publicKey);
}

export async function hasAuthedUser(req: IncomingMessage) {
    return (await getAuthedUser(req)) !== undefined;
}
