import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { useSession } from "sst/node/auth";

import { generateHistoricalEventsUsecase } from "@core/usecases/generateHIstoricalEventsUsecase";
import { openAILanguageModelService } from "@core/services/openAILanguageModelService";

export const handler = ApiHandler(async (event) => {
  const session = useSession();

  if (session.type !== "user") {
    throw new Error("Not authenticated");
  }

  const { body } = validateEvent(event);
  const { topic } = body;

  console.log("Create historical events endpoint called", {
    event,
    topic,
  });

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

  let rawBody = event.body as string;

  if (event.isBase64Encoded) {
    const buff = Buffer.from(rawBody, "base64");
    const text = buff.toString("utf-8");
    rawBody = text;
  }

  const body = JSON.parse(rawBody) as { topic: string };

  if (!body.topic) {
    throw new Error("Missing topic");
  }

  if (typeof body.topic !== "string") {
    throw new Error("Invalid topic");
  }

  return { body };
}
