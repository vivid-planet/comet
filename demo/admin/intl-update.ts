import { Gitlab } from "@gitbeaker/node";
import { existsSync, promises, readFileSync } from "fs";
import { homedir, hostname } from "os";
import { dirname } from "path";

let gitlabToken = process.env.GITLAB_API_TOKEN;
if (!gitlabToken) {
    const gitlabTokenFile = `${homedir()}/.gitlab_token`;
    if (!existsSync(gitlabTokenFile)) {
        console.warn(
            `Environment-Variable GITLAB_API_TOKEN not present and ${gitlabTokenFile} doesn't exist on '${hostname()}'. Please create a personal token at https://gitlab.vivid-planet.com/profile/personal_access_tokens and save it into this file (both on your machine and your virtual machine on the server`,
        );

        process.exit(0);
    }

    gitlabToken = readFileSync(gitlabTokenFile).toString().trim();
}

void (async () => {
    const api = new Gitlab({
        host: "https://gitlab.vivid-planet.com",
        token: gitlabToken,
    });

    const cloneRecursively = async (destinationFolder: string, projectName: string) => {
        const projects = await api.Projects.search(projectName);
        if (projects.length < 1) {
            console.error(`No results found for: ${projectName}`);
            process.exit(0);
        }
        const projectId = projects[0].id;

        const fileTree = await api.Repositories.tree(projectId, { recursive: true });
        for (const file of Array.isArray(fileTree) ? fileTree : [fileTree]) {
            const type = file.type;
            const name = file.name as string;
            const filePath = file.path as string;

            if (type === "blob" && name.endsWith(".json")) {
                const raw = await api.RepositoryFiles.showRaw(projectId, filePath, "master");

                const destinationPath = `${destinationFolder}/${file.path}`;
                if (!existsSync(dirname(destinationPath))) {
                    await promises.mkdir(dirname(destinationPath), {
                        recursive: true,
                    });
                }

                await promises.writeFile(destinationPath, raw.toString());
            }
        }
    };

    console.log("Cloning comet-admin-lang...");
    await cloneRecursively("comet-admin-lang", "comet-admin-lang");

    console.log("Cloning admin-cms-lang...");
    await cloneRecursively("admin-cms-lang", "cms-admin-lang");

    console.log("Cloning admin-blocks-lang...");
    await cloneRecursively("admin-blocks-lang", "blocks-admin-lang");

    // TODO add Comet Demo lang repo
    /* console.log("Cloning comet-demo-admin-lang...");
    await cloneRecursively("comet-demo-lang", "comet-demo-lang"); */
})();
