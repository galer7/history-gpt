import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getEventsFromLLM = async (topic: string) => {
  return await openai.chat.completions.create({
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
};
