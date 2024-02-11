import OpenAI from "openai";
import { useQuery } from "@tanstack/react-query";

import { ExtractFnReturnType, QueryConfig } from "./../../../lib/react-query";
import { HistoricalEvent } from "../types";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getEvents = async (topic: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a historian. You are writing a brief visual history of ${topic}.`,
      },
    ],
    model: "gpt-3.5-turbo",
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
  });

  const events = JSON.parse(
    response.choices[0].message.tool_calls?.[0].function.arguments || "[]"
  ).events as HistoricalEvent[];

  console.log("[getEvents] events", events);

  return events;
};

type QueryFnType = typeof getEvents;

type UseEventsOptions = {
  topic: string;
  config?: QueryConfig<QueryFnType>;
};

export const useEvents = ({ config, topic }: UseEventsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["events", topic],
    queryFn: () => getEvents(topic),
  });
};
