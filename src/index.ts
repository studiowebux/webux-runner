import yaml from "js-yaml";
import { readFileSync } from "fs";
import { resolve } from "node:path";
import { validatePipelineFirstActionCategory } from "./libs/validators";
import { handleAction } from "./libs/handlers";

async function readPipelineDefinition(pipeline: string) {
  const definition: IDefinition = yaml.load(
    readFileSync(resolve(__dirname, pipeline), "utf-8")
  ) as IDefinition;
  const dirname = resolve("workspace", `scripts_${Date.now()}`);

  let idx = 0;
  for await (const stage of definition.Pipeline.Stages) {
    console.debug(`Stage #${idx} - ${stage.Name}`);
    for await (const action of stage.Actions.sort(
      (a, b) => a.RunOrder - b.RunOrder
    )) {
      if (idx === 0) validatePipelineFirstActionCategory(action);

      await handleAction(
        action.ActionTypeId.Category,
        action,
        definition,
        dirname
      );
    }
    idx++;
  }
}

// function gatherJobDefinitions() {}

// function readJobDefinition() {}

function handler(pipeline: string) {
  readPipelineDefinition(pipeline);
}

// function graph(definition){

// }

(() => {
  try {
    handler(resolve("pipeline.yml"));
  } catch (e: any) {
    process.exit(1);
  }
})();
