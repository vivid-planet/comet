import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

declare module "nestjs-cls" {
    interface ClsStore {
        userId: string;
    }
}

@Injectable()
export class ActionLogsContextService {
    constructor(private readonly cls: ClsService) {}

    async getUserId(): Promise<string> {
        return this.cls.get("userId");
    }

    async setUserId(userId: string): Promise<void> {
        this.cls.set("userId", userId);
    }

    async runWithUserId(userId: string, callback: () => Promise<void>): Promise<void> {
        return this.cls.runWith({ userId }, callback);
    }
}
