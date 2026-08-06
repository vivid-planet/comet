import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { faker } from "@src/db/fixtures/faker";
import { MailButtonAlignment, MailButtonVariant } from "@src/welcome-email/blocks/mail-button.block";
import { MailSpacing } from "@src/welcome-email/blocks/mail-spacer.block";
import { WelcomeEmailContentBlock } from "@src/welcome-email/blocks/welcome-email-content.block";
import { WelcomeEmail } from "@src/welcome-email/entities/welcome-email.entity";

import { PixelImageBlockFixtureService } from "./blocks/media/pixel-image-block-fixture.service";

type MailTextVariant = "title" | "header" | "copy";

function richTextDraftContent(paragraphs: Array<{ text: string; type: MailTextVariant }>) {
    return {
        blocks: paragraphs.map(({ text, type }) => ({
            key: faker.string.uuid(),
            text,
            type,
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        })),
        entityMap: {},
    };
}

@Injectable()
export class WelcomeEmailFixtureService {
    private logger = new Logger(WelcomeEmailFixtureService.name);

    constructor(
        private readonly entityManager: EntityManager,
        private readonly pixelImageBlockFixtureService: PixelImageBlockFixtureService,
    ) {}

    async generate(): Promise<void> {
        this.logger.log("Generating welcome email...");

        const titleContent = richTextDraftContent([{ text: "Welcome to our newsletter", type: "title" }]);
        const imageProps = await this.pixelImageBlockFixtureService.generateBlockInput();
        const bodyContent = richTextDraftContent([
            { text: "Hi there, and thanks for subscribing — we're glad to have you on board.", type: "copy" },
            {
                text: "You'll be the first to hear about product updates, handy tips, and stories from our team. No spam, ever — just the good stuff.",
                type: "copy",
            },
        ]);

        const content = WelcomeEmailContentBlock.blockInputFactory({
            blocks: [
                { key: faker.string.uuid(), visible: true, type: "spacer", props: { spacing: MailSpacing.medium } },
                { key: faker.string.uuid(), visible: true, type: "richText", props: { draftContent: titleContent } },
                { key: faker.string.uuid(), visible: true, type: "spacer", props: { spacing: MailSpacing.medium } },
                { key: faker.string.uuid(), visible: true, type: "image", props: { image: imageProps, fullWidth: true } },
                { key: faker.string.uuid(), visible: true, type: "spacer", props: { spacing: MailSpacing.small } },
                { key: faker.string.uuid(), visible: true, type: "richText", props: { draftContent: bodyContent } },
                { key: faker.string.uuid(), visible: true, type: "spacer", props: { spacing: MailSpacing.large } },
                {
                    key: faker.string.uuid(),
                    visible: true,
                    type: "richText",
                    props: {
                        draftContent: {
                            blocks: [
                                {
                                    key: faker.string.uuid(),
                                    text: "Further information",
                                    type: "header",
                                    depth: 0,
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                },
                                {
                                    key: faker.string.uuid(),
                                    text: "Call our support hotline for help or check the FAQ.",
                                    type: "copy",
                                    depth: 0,
                                    inlineStyleRanges: [],
                                    entityRanges: [
                                        { offset: 9, length: 15, key: 0 },
                                        { offset: 47, length: 3, key: 1 },
                                    ],
                                    data: {},
                                },
                            ],
                            entityMap: {
                                "0": {
                                    type: "LINK",
                                    mutability: "MUTABLE",
                                    data: { attachedBlocks: [{ type: "phone", props: { phone: "+431234567" } }], activeType: "phone" },
                                },
                                "1": {
                                    type: "LINK",
                                    mutability: "MUTABLE",
                                    data: {
                                        attachedBlocks: [
                                            {
                                                type: "external",
                                                props: { targetUrl: "https://example.com/faq", openInNewWindow: true, noFollow: false },
                                            },
                                        ],
                                        activeType: "external",
                                    },
                                },
                            },
                        },
                    },
                },
                { key: faker.string.uuid(), visible: true, type: "spacer", props: { spacing: MailSpacing.medium } },
                {
                    key: faker.string.uuid(),
                    visible: true,
                    type: "button",
                    props: {
                        text: "Visit our website",
                        link: { targetUrl: "https://example.com", openInNewWindow: true, noFollow: false },
                        variant: MailButtonVariant.filled,
                        align: MailButtonAlignment.left,
                    },
                },
                { key: faker.string.uuid(), visible: true, type: "spacer", props: { spacing: MailSpacing.medium } },
            ],
        }).transformToBlockData();

        const welcomeEmail = this.entityManager.create(WelcomeEmail, {
            scope: { domain: "main", language: "en" },
            content,
        });

        this.entityManager.persist(welcomeEmail);
    }
}
