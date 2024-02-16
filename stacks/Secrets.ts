import { Config, StackContext } from "sst/constructs";

export function Secrets({ stack }: StackContext) {
  const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");

  return {
    OPENAI_API_KEY,
    GOOGLE_CLIENT_ID,
  };
}
