import { DamImageBlock } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository, MikroORM } from "@mikro-orm/postgresql";
import { Inject } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { WarningSeverity } from "@src/warnings/entities/warning-severity.enum";
import { WarningService } from "@src/warnings/warning.service";
import { Command, CommandRunner } from "nest-commander";
import slugify from "slugify";

import { NewsContentBlock } from "./blocks/news-content.block";
import { News, NewsCategory, NewsStatus } from "./entities/news.entity";

@Command({
    name: "sync-news",
    description: "Demo Implementation for syncing news",
    arguments: "<domain> <language>",
})
export class SyncNewsCommand extends CommandRunner {
    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly orm: MikroORM,
        @InjectRepository(News) private readonly repository: EntityRepository<News>,
        private readonly entityManager: EntityManager,
        private readonly warningService: WarningService,
    ) {
        super();
    }

    @CreateRequestContext()
    async run([domain, language]: string[]): Promise<void> {
        const warningMetaData = {
            jobName: SyncNewsCommand.name,
            domain,
            language,
        };
        try {
            for (const news of await this.fetchNewsList()) {
                if (news.category) {
                    this.repository.create({
                        title: news.title,
                        slug: slugify(news.title),
                        status: NewsStatus.Active,
                        scope: {
                            domain,
                            language,
                        },
                        image: DamImageBlock.blockInputFactory({ attachedBlocks: [] }).transformToBlockData(),
                        content: NewsContentBlock.blockInputFactory({ blocks: [] }).transformToBlockData(),
                        date: new Date(),
                        category: news.category,
                    });

                    await this.entityManager.flush();
                    // Remove the warning if the news item was successfully created
                    await this.warningService.deleteCustomWarning({
                        type: "Job",
                        metadata: {
                            ...warningMetaData,
                            slug: news.slug,
                        },
                    });
                } else {
                    // Add a warning where the required property category is missing
                    await this.warningService.saveCustomWarning({
                        warning: { message: "jobNewsMissingRequiredPropertyCategory", severity: WarningSeverity.low },
                        type: "Job",
                        metadata: {
                            ...warningMetaData,
                            slug: news.slug,
                        },
                    });
                }
            }
            await this.warningService.deleteCustomWarning({
                type: "Job",
                metadata: warningMetaData,
            });
        } catch (e) {
            await this.warningService.saveCustomWarning({
                warning: { message: "jobNewsFailedToSync", severity: WarningSeverity.high },
                type: "Job",
                metadata: warningMetaData,
            });
            console.error("Failed to sync news", e);
        }
    }

    async fetchNewsList() {
        // To simulate that the sync fails sometimes
        if (Math.random() > 0.5) {
            throw new Error("Failed to fetch news");
        }

        // A few news item have the category property missing to simulate a data issue (it should simulate that the data is defined as required, but the external API is not delivering it nevertheless)
        // The job should add a warning for these items, but still create the other news items.
        return [
            { title: "Local Festival Attracts Thousands of Visitors", slug: "local-festival-crowd", category: NewsCategory.Events },
            { title: "Tech Conference Showcases Innovations for 2025", slug: "tech-conference-innovations", category: NewsCategory.Events },
            { title: "Groundbreaking Ceremony Marks New Development", slug: "groundbreaking-ceremony" },
            { title: "Company Expands Operations to New Markets", slug: "company-expansion-new-markets", category: NewsCategory.Company },
            { title: "Startup Announces New Eco-Friendly Product Line", slug: "startup-eco-friendly-products", category: NewsCategory.Company },
            { title: "Annual Business Awards Recognize Industry Leaders", slug: "annual-business-awards", category: NewsCategory.Awards },
            { title: "Local Restaurant Wins Best Dining Experience Award", slug: "restaurant-best-dining-award", category: NewsCategory.Awards },
            { title: "Community Organizes Charity Event for Education", slug: "charity-event-education", category: NewsCategory.Events },
            { title: "Tech Firm Celebrates 10 Years of Innovation", slug: "tech-firm-10-years", category: NewsCategory.Company },
            { title: "Film Festival Honors Emerging Directors", slug: "film-festival-awards", category: NewsCategory.Awards },
            { title: "City Hosts Largest Job Fair of the Year", slug: "largest-job-fair", category: NewsCategory.Events },
            { title: "Historic Building to Be Restored by Community", slug: "historic-building-restoration" },
        ];
    }
}
