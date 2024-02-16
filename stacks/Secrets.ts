import { Config, StackContext } from "sst/constructs";

export function Secrets({ stack }: StackContext) {
  const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

  return {
    OPENAI_API_KEY,
  };
}
