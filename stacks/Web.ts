import { StackContext, StaticSite, use } from "sst/constructs";

import { API } from "./API";

export function Web({ stack }: StackContext) {
  const api = use(API);

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_API_URL: api.url,
    },
    customDomain:
      stack.stage === "prod"
        ? {
            domainName: "history-gpt.galer7.com",
            hostedZone: "history-gpt.galer7.com",
          }
        : undefined,
  });

  stack.addOutputs({
    Web: web.customDomainUrl || web.url,
  });
}
