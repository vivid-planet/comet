import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { Product } from "./entities/product.entity";

@Injectable()
@Console()
export class ProductsConsole {
    constructor(
        private readonly orm: MikroORM, // MikroORM is injected so we can use the request context
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
    ) {}

    @Command({
        command: "demo-command",
        description: "Demo-Command for cronjob-deployment",
    })
    @UseRequestContext()
    async demoCommand(): Promise<void> {
        console.log(new Date().toUTCString());
        console.log("Execute demo-command.");
        const all = await this.repository.findAll();
        const p = all[2];
        console.log(p);
        p.price = undefined;
        console.log(p);
        await this.repository.flush();
    }
}
