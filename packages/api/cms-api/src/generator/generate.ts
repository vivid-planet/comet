import { ConfigurationLoader, MikroORM, Options, Utils } from "@mikro-orm/core";
import { Command } from "commander";

import { generateCrud } from "./generate-crud";

const generate = new Command("generate").action(async (options) => {
    const orm = await getORM(false);

    const entities = orm.em.getMetadata().getAll();

    for (const name in entities) {
        const entity = entities[name];
        await generateCrud(entity);
    }

    await orm.close(true);
});

const program = new Command();

program.addCommand(generate);

program.parse();

async function getORM(warnWhenNoEntities?: boolean, opts: Partial<Options> = {}): Promise<MikroORM> {
    const options = await ConfigurationLoader.getConfiguration(warnWhenNoEntities, opts);
    options.set("allowGlobalContext", true);
    const settings = await ConfigurationLoader.getSettings();
    options.getLogger().setDebugMode(false);

    if (settings.useTsNode) {
        options.set("tsNode", true);
    }

    if (Utils.isDefined(warnWhenNoEntities)) {
        options.get("discovery").warnWhenNoEntities = warnWhenNoEntities;
    }

    return MikroORM.init(options);
}
