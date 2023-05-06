import { exec } from "node:child_process";
import path from "node:path";

export const launchDocker = async (
  job: IJob,
  dirname: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    let cmd = "docker run -t --rm";

    // Environment
    cmd += job.env.map((env: string) => ` -e ${env}`);
    cmd += ` -e TIMEOUT=${job.timeout}`;

    // Volume
    cmd += ` -v ${dirname}:/scripts`;
    cmd += ` -v ${path.resolve(
      __dirname,
      "..",
      "scripts",
      "entrypoint.sh"
    )}:/entrypoint.sh`;

    // Image
    cmd += ` ${job.image}`;

    // Launch command
    cmd += ` /bin/bash -c '/entrypoint.sh'`;

    // Start Docker
    const dockerCmd = exec(cmd);

    dockerCmd?.stdout?.on("data", (data) => {
      console.debug(data);
    });

    dockerCmd.on("exit", (code) => {
      console.log(`Docker has exit with code: ${code}`);
      if (code !== 0) {
        return reject(code);
      }
      return resolve(code);
    });
  });
};
