import { SSTConfig } from "sst";

import { Web } from "./stacks/Web";
import { Secrets } from "./stacks/Secrets";
import { API } from "./stacks/API";

export default {
  config(_input) {
    return {
      name: "history-gpt",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(Secrets).stack(API).stack(Web);
  },
} satisfies SSTConfig;
