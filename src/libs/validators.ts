import { CATEGORY } from "./defaults";

export function validatePipelineFirstActionCategory(action: IAction) {
  if (action.ActionTypeId.Category !== CATEGORY.SOURCE) {
    throw new Error(
      `The pipeline first step must be of type \`${CATEGORY.SOURCE}\` for the category.`
    );
  }
}
