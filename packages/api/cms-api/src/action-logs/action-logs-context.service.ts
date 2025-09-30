import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

const USER_ID_KEY = Symbol("userId");

declare module "nestjs-cls" {
    interface ClsStore {
        [USER_ID_KEY]: string;
    }
}

@Injectable()
export class ActionLogsContextService {
    constructor(private readonly cls: ClsService) {}

    hasUserId(): boolean {
        return this.cls.has(USER_ID_KEY);
    }

    async getUserId(): Promise<string> {
        return this.cls.get(USER_ID_KEY);
    }

    async setUserId(userId: string): Promise<void> {
        this.cls.set(USER_ID_KEY, userId);
    }

    async runWithUserId(userId: string, callback: () => Promise<void>): Promise<void> {
        return this.cls.runWith({ [USER_ID_KEY]: userId }, callback);
    }
}
