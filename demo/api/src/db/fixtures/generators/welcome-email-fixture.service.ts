import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { faker } from "@src/db/fixtures/faker";
import { WelcomeEmailContentBlock } from "@src/welcome-email/blocks/welcome-email-content.block";
import { WelcomeEmail } from "@src/welcome-email/entities/welcome-email.entity";

interface WelcomeEmailScope {
    domain: string;
    language: string;
}

@Injectable()
export class WelcomeEmailFixtureService {
    private logger = new Logger(WelcomeEmailFixtureService.name);

    constructor(private readonly entityManager: EntityManager) {}

    async generate(scope: WelcomeEmailScope): Promise<void> {
        this.logger.log("Generating welcome email...");

        const welcomeEmail = this.entityManager.create(WelcomeEmail, {
            scope,
            content: WelcomeEmailContentBlock.blockInputFactory({
                blocks: [
                    { key: faker.string.uuid(), visible: true, type: "text", props: greeting },
                    { key: faker.string.uuid(), visible: true, type: "divider", props: {} },
                    { key: faker.string.uuid(), visible: true, type: "text", props: nextSteps },
                ],
            }).transformToBlockData(),
        });

        this.entityManager.persist(welcomeEmail);
    }
}

const greeting = {
    draftContent: {
        blocks: [
            { key: "welcome", text: "Welcome to Dextinity", type: "title", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            {
                key: "intro",
                text: "Your account is ready. We are glad to have you on board.",
                type: "copy",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
        ],
        entityMap: {},
    },
};

const nextSteps = {
    draftContent: {
        blocks: [
            { key: "next-steps", text: "What happens next", type: "header", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            {
                key: "next-steps-text",
                text: "Sign in to the admin to edit this mail. Every change shows up in the preview beside the form.",
                type: "copy",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
        ],
        entityMap: {},
    },
};
