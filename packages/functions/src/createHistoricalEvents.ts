import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";

import { generateHistoricalEventsUsecase } from "@core/usecases/generateHIstoricalEventsUsecase";
import { openAILanguageModelService } from "@core/services/openAILanguageModelService";

export const handler = ApiHandler(async (event) => {
  const { body } = validateEvent(event);
  const { topic } = body;

  const events = await generateHistoricalEventsUsecase({
    languageModelService: openAILanguageModelService({
      apiKey: Config.OPENAI_API_KEY,
    }),
  })({ topic });

  return {
    statusCode: 200,
    body: JSON.stringify(events),
  };
});

function validateEvent(event: APIGatewayProxyEventV2) {
  if (!event.body) {
    throw new Error("Missing body");
  }

  const body = JSON.parse(event.body) as { topic: string };

  if (!body.topic) {
    throw new Error("Missing topic");
  }

  if (typeof body.topic !== "string") {
    throw new Error("Invalid topic");
  }

  return { body };
}
