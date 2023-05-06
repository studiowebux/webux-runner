import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { resolve } from "node:path";
import { execSync } from "child_process";
import { createHmac } from "crypto";
import { fetchCredentials } from "./credentials";
import { loadProjectDefinition } from "./loader";
import { executeJob } from "./executor";
import { SCM_PROVIDER } from "./defaults";

export function handleSourceAction(action: IAction, dirname: string) {
  console.debug("Source Action");
  let keyname = null;
  try {
    // FIXME: this mkdir should be earlier in the steps
    mkdirSync(dirname, { recursive: true });
    // Step 1. Identify Provider
    const provider = action.ActionTypeId.Provider as Provider;
    console.debug(`Using ${provider} provider`);

    // Step 2. Get the connection information (access key, ssh, etc.)
    const credentials = fetchCredentials(
      action.Configuration.Connection as string
    );
    if (!credentials) throw new Error("Unable to fetch credentials.");
    keyname = createHmac("sha256", credentials.substring(0, 27)).digest("hex");
    writeFileSync(
      resolve(dirname, keyname),
      Buffer.from(credentials, "base64"),
      {
        mode: 400,
      }
    );

    // Step 3. Build command to clone the repository locally
    execSync(
      `PKEY=${resolve(dirname, keyname)} GIT_SSH=${resolve(
        __dirname,
        "..",
        "scripts",
        "ssh-git.sh"
      )} git clone ${
        SCM_PROVIDER[provider] // FIXME: this is not supposed to be here
      }:${action.Configuration.FullRepositoryId}.git ${resolve(
        process.env.WORKSPACE_DIR || "./workspace/",
        dirname,
        action.Configuration.FullRepositoryId as string
      )}`
    );

    // Step 4. Save the files locally in a temporary folder
    mkdirSync(
      resolve(
        process.env.WORKSPACE_DIR || "./workspace/",
        dirname,
        action.Configuration.FullRepositoryId as string
      ),
      { recursive: true }
    );
    execSync(
      `PKEY=${resolve(dirname, keyname)} GIT_SSH=${resolve(
        __dirname,
        "..",
        "scripts",
        "ssh-git.sh"
      )} cd ${resolve(
        process.env.WORKSPACE_DIR || "./workspace/",
        dirname,
        action.Configuration.FullRepositoryId as string
      )} && git checkout ${action.Configuration.BranchName}`
    );
  } catch (e: any) {
    console.error(e.message);
    throw e;
  } finally {
    // Step 5. Cleanup
    if (!keyname) return;
    unlinkSync(resolve(dirname, keyname as string));
  }
}

export function handleDeployAction(
  action: IAction,
  definition: IDefinition,
  dirname: string
) {
  console.debug(`Deploy Action - \`${action.Name}\``);
}

export async function handleBuildAction(
  action: IAction,
  definition: IDefinition,
  dirname: string
) {
  console.debug(`Build Action - \`${action.Name}\``);

  const provider = action.ActionTypeId.Provider;
  const name = action.Configuration.ProjectName as string;

  const job = loadProjectDefinition(name, definition);
  if (job) {
    const result = await executeJob(provider, job, dirname);
    console.debug(result);
  }
}

export function handleTestAction(
  action: IAction,
  definition: IDefinition,
  dirname: string
) {
  console.debug(`Test Action - \`${action.Name}\``);
}
