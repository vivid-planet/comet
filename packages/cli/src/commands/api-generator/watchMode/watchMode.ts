import console from "node:console";

import { type ChildProcessWithoutNullStreams, spawn } from "child_process";
import { watch } from "chokidar";

import { handleChildProcess } from "./handleChildProcess";

/**
 * Watch mode for the generator.
 *
 * Watches the `src` directory for changes and triggers child processes of generator for the changed file, to process it.
 */
export const watchMode = async () => {
    /**
     * Collection of last ChildProcesses for each file
     */
    const childProcesses: Record<string, ChildProcessWithoutNullStreams> = {};
    watch("./src", {
        awaitWriteFinish: {
            stabilityThreshold: 300,
            pollInterval: 200,
        },
        ignored: (path, stats) => {
            if (stats?.isFile()) {
                return !path.endsWith("entity.ts");
            }
            return false;
        },
    })
        .on("change", async (path) => {
            console.log(`🚀 File changed: ${path}`);

            // Kill running processes for the changed file
            if (childProcesses[path]) {
                if (childProcesses[path].exitCode == null) {
                    console.log("💀 Killed running process for file: ", path);
                    childProcesses[path].kill();
                }
                delete childProcesses[path];
            }

            // Generate changed file with child process.
            //
            // Triggering the generator with changed files in the same process has problems with
            // reflection and new Classes / Decorator are not recognised correctly.
            const childProcess = spawn(`node ${__dirname}/../../../../bin/comet.js api-generator -f ${path}`, {
                shell: true,
            });
            childProcesses[path] = childProcess;

            try {
                handleChildProcess(childProcess);
            } catch (e) {
                console.error(`❌ Error processing ${path} with error: ${e}`);
            }
        })
        .on("error", (error) => {
            console.error(`Watcher error: ${error}`);
        });
};
