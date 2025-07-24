const { spawn, exec } = require("child_process");

spawn("docker", ["compose", "up"], { stdio: "inherit" });

process.on("SIGINT", function () {
    exec(`docker compose down`, function (error) {
        process.exit(error ? 1 : 0);
    });
});
