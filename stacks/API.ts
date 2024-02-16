import { Api, Auth, StackContext, Table, use } from "sst/constructs";
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
