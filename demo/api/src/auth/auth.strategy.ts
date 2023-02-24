import { CurrentUserInterface, StaticAuthedUserStrategy } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthStrategy extends StaticAuthedUserStrategy {
    // You can use Dependency Injection here (e.g. injecting a repository from which the user will be loaded in validate())
    constructor() {
        super({
            userIdentifier: "admin", // Change this to switch user
        });
    }

    validate(userIdentifier: string): CurrentUserInterface | undefined {
        const users = [
            {
                id: "admin",
                name: "Test Admin",
                email: "admin@comet-dxp.com",
                language: "en",
                role: "admin",
                domains: ["main", "secondary"],
            },
            {
                id: "superuser",
                name: "Test Superuser",
                email: "superuser@comet-dxp.com",
                language: "en",
                role: "superuser",
                domains: ["main"],
            },
        ];
        return users.find((user) => user.id === userIdentifier);
    }
}
