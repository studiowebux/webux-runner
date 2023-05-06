import yaml from "js-yaml";

export function loadProjectDefinition(
  name: string,
  definition: IDefinition
): IJob | null {
  const job = definition[name];

  if (!job) {
    console.error(`Job ${name} Not Found, skipping.`);
    return null;
  }

  return {
    env: job.Environment.EnvironmentVariables.filter(
      (v) => v.Type === "PLAINTEXT"
    ).map((ev) => `${ev.Name}=${ev.Value}`),
    image: job.Environment.Image,
    timeout: job.TimeoutInMinutes * 60,
    tasks: yaml.load(job.BuildSpec) as IBuild,
  };
}
