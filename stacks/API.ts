import { Api, StackContext, use } from "sst/constructs";
import { Secrets } from "./Secrets";

export function API({ stack }: StackContext) {
  const { OPENAI_API_KEY } = use(Secrets);

  const api = new Api(stack, "api", {
    routes: {
      "POST /events": "packages/functions/src/createHistoricalEvents.handler",
    },
  });

  api.bind([OPENAI_API_KEY]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return api;
}
