const exec = require("child_process").exec;

let now = new Date();
let dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}__${now.getUTCHours()}-${now.getUTCMinutes()}-${now.getUTCSeconds()}`;
let cmd = "yarn directus schema snapshot --yes ./schema/schema.yml";

exec(cmd, (error, stdout, stderr) => {
    console.log(stdout);
});
