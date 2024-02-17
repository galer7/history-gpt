import { Api, StackContext, use, Table, Auth } from "sst/constructs";

import { Secrets } from "./Secrets";

export function API({ stack }: StackContext) {
  const { OPENAI_API_KEY, GOOGLE_CLIENT_ID } = use(Secrets);

  const table = new Table(stack, "users", {
    fields: {
      userId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
  });

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
      environment: {
        REDIRECT_URL:
          stack.stage === "prod"
            ? "https://history-gpt.galer7.com"
            : "http://localhost:3008",
      },
    },
  });

  const api = new Api(stack, "api", {
    routes: {
      "GET /session": "packages/functions/src/session.handler",
      "POST /events": "packages/functions/src/createHistoricalEvents.handler",
    },
  });

  api.bind([table, OPENAI_API_KEY, GOOGLE_CLIENT_ID]);

  auth.attach(stack, {
    api,
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return api;
}
