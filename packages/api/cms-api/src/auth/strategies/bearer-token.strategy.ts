import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import https, { Agent } from "https";
import NodeCache from "node-cache";
import fetch from "node-fetch";
import { Strategy } from "passport-http-bearer";
import { URLSearchParams } from "url";

import { AUTH_CURRENT_USER_LOADER, BEARER_TOKEN_CONFIG } from "../auth.constants";
import { BearerTokenConfig } from "../auth.module";
import { CurrentUser } from "../dto/current-user";
import { CurrentUserLoaderInterface } from "../interfaces/current-user-loader.interface";

@Injectable()
export class BearerTokenStrategy extends PassportStrategy(Strategy) {
    private validatedUserCache: NodeCache;
    private httpsAgent: Agent;
    constructor(
        @Inject(forwardRef(() => BEARER_TOKEN_CONFIG)) private readonly config: BearerTokenConfig,
        @Inject(AUTH_CURRENT_USER_LOADER) private readonly currentUserLoader: CurrentUserLoaderInterface,
    ) {
        super();
        this.validatedUserCache = new NodeCache();
        this.httpsAgent = new https.Agent({
            keepAlive: true,
        });
    }

    async validate(token: string): Promise<CurrentUser | null | undefined> {
        let validatedUser: CurrentUser | null | undefined = this.validatedUserCache.get(token);
        if (validatedUser === undefined) {
            validatedUser = await this.getValidatedUser(token);
            this.validatedUserCache.set(token, validatedUser, 60);
        }
        return validatedUser;
    }

    async getValidatedUser(token: string): Promise<CurrentUser | null> {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Forwarded-Proto": "https",
        };
        if (this.config.idpConfig.password) {
            Object.assign(headers, { Authorization: `Basic ${Buffer.from(`vivid:${this.config.idpConfig.password}`).toString("base64")}` });
        }
        const response = await fetch(`${this.config.idpConfig.url}/oauth2/introspect`, {
            method: "POST",
            headers,
            agent: this.httpsAgent,
            body: new URLSearchParams({ token, client_id: this.config.idpConfig.clientId }).toString(), // client_id should not be necessary but oidc-provider needs it
        });

        if (response.status !== 200) return null;

        const data = await response.json();

        if (!data || !data.active) return null;
        if (data.client_id !== this.config.idpConfig.clientId) return null;

        return this.currentUserLoader.load(token, data);
    }
}
