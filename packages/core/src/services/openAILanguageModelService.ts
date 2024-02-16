import OpenAI from "openai";

import { LanguageModelService } from "@core/boundaries/LanguageModelService";
import { HistoricalEvent } from "@core/entities/HistoricalEvent";

interface OpenAILanguageModelServiceDependencies {
  apiKey: string;
}

export const openAILanguageModelService = ({
  apiKey,
}: OpenAILanguageModelServiceDependencies): LanguageModelService => {
  const openai = new OpenAI({
    apiKey,
  });

  const getHistoricalEvents = async (topic: string) => {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a historian. You are writing a brief visual history of ${topic}.`,
        },
      ],
      model: "gpt-3.5-turbo",
      ...getHistoryToolsConfig(),
    });

    const events = JSON.parse(
      response.choices[0].message.tool_calls?.[0].function.arguments || "[]"
    ).events as HistoricalEvent[];

    return events;
  };

  return {
    getHistoricalEvents,
  };
};

function getHistoryToolsConfig(): {
  tool_choice: OpenAI.Chat.Completions.ChatCompletionToolChoiceOption;
  tools: OpenAI.Chat.Completions.ChatCompletionTool[];
} {
  return {
    tool_choice: {
      type: "function",
      function: {
        name: "history",
      },
    },
    tools: [
      {
        type: "function",
        function: {
          name: "history",
          description: "Get historical events for a topic",
          parameters: {
            type: "object",
            properties: {
              events: {
                type: "array",
                description: "The historical events",
                items: {
                  type: "object",
                  properties: {
                    lat: {
                      type: "number",
                      description: "The latitude of the location of the event",
                    },
                    lon: {
                      type: "number",
                      description: "The longitude of the location of the event",
                    },
                    date: {
                      type: "string",
                      description: "The date of the event",
                    },
                    title: {
                      type: "string",
                      description: "The title of the event",
                    },
                    description: {
                      type: "string",
                      description:
                        "A text description of the event, including the event name",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  };
}
