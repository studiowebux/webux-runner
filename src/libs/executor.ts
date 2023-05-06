import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { launchDocker } from "./docker";

export async function executeJob(
  provider: Provider,
  job: IJob,
  dirname: string
) {
  try {
    if (!job) throw new Error("No job defined.");
    const commands: Record<string, IPhaseParsed> = {};

    // Save Scripts
    const header = `#!/bin/bash
    
    set -o pipefail
    set -o errtrace
    set -o nounset
    set -o errexit
    
    trap 'catch $? $LINENO' EXIT
    
    catch(){
        if [ $1 != 0 ]; then
            echo Code: $1 Line number: $2
            echo "trap triggered"
        fi
        ##FINALLY##
    }
    
    `;

    Object.keys(job.tasks.phases)
      .filter((p) =>
        ["install", "pre_build", "build", "post_build"].includes(p)
      )
      .forEach((phaseKey: string) => {
        commands[phaseKey] = { commands: "", finally: "" };
        commands[phaseKey].commands = `echo "[${phaseKey}](COMMANDS)"\n`;
        commands[phaseKey].finally = `echo "[${phaseKey}](FINALLY)"\n`;

        job.tasks.phases[phaseKey].commands.forEach((c, ci) => {
          commands[phaseKey].commands += `${c}\n`;
        });
        job.tasks.phases[phaseKey].finally.forEach((f, fi) => {
          commands[phaseKey].finally += `${f}\n`;
          if (job.tasks.phases[phaseKey]["on-failure"] === "ABORT") {
            commands[phaseKey].finally += "exit $1";
          }
        });
      });

    writeFileSync(
      resolve(
        process.env.WORKSPACE_DIR || "./workspace/",
        dirname,
        "install.sh"
      ),
      header.replace("##FINALLY##", commands.install.finally) +
        commands.install.commands,
      {
        mode: 0o0644,
        encoding: "utf-8",
      }
    );
    writeFileSync(
      resolve(
        process.env.WORKSPACE_DIR || "./workspace/",
        dirname,
        "pre_build.sh"
      ),
      header.replace("##FINALLY##", commands.pre_build.finally) +
        commands.pre_build.commands,
      {
        mode: 0o0644,
        encoding: "utf-8",
      }
    );
    writeFileSync(
      resolve(process.env.WORKSPACE_DIR || "./workspace/", dirname, "build.sh"),
      header.replace("##FINALLY##", commands.build.finally) +
        commands.build.commands,
      {
        mode: 0o0644,
        encoding: "utf-8",
      }
    );
    writeFileSync(
      resolve(
        process.env.WORKSPACE_DIR || "./workspace/",
        dirname,
        "post_build.sh"
      ),
      header.replace("##FINALLY##", commands.post_build.finally) +
        commands.post_build.commands,
      {
        mode: 0o0644,
        encoding: "utf-8",
      }
    );

    await launchDocker(job, dirname);
  } catch (e: any) {
    console.error(e.message);
    throw e;
  } finally {
    console.debug("Finally");
    // console.debug(stdout.toString());
    // clearTimeout(timeout);
    // rmSync(resolve(__dirname, dirname), { recursive: true, force: true });
  }
}
