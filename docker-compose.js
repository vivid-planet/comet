const { spawn, exec } = require("child_process");

const apmArgs = process.env.API_ENABLE_APM ? ["-f", "docker-compose.yml", "-f", "docker-compose.apm.yml"] : [];

spawn("docker-compose", [...apmArgs, "up"], { stdio: "inherit" });

process.on("SIGINT", function () {
    const args = [...apmArgs, "down"];

    exec(`docker-compose ${args.join(" ")}`, function (error) {
        process.exit(error ? 1 : 0);
    });
});
