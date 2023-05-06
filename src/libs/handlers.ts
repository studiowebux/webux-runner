import {
  handleBuildAction,
  handleDeployAction,
  handleSourceAction,
  handleTestAction,
} from "./actions";
import { CATEGORY } from "./defaults";

export async function handleAction(
  category: Category,
  action: IAction,
  definition: IDefinition,
  dirname: string
) {
  switch (category) {
    case CATEGORY.SOURCE:
      handleSourceAction(action, dirname);
      break;
    case CATEGORY.DEPLOY:
      handleDeployAction(action, definition, dirname);
      break;
    case CATEGORY.BUILD:
      await handleBuildAction(action, definition, dirname);
      break;
    case CATEGORY.TEST:
      handleTestAction(action, definition, dirname);
      break;
  }
}
