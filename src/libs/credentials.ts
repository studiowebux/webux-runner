import { SCM_PROVIDER } from "./defaults";

export function fetchCredentials(connection: string) {
  if (connection === SCM_PROVIDER.Github) return process.env.CREDENTIALS;
}
