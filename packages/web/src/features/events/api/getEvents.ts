import { useQuery } from "@tanstack/react-query";

import { HistoricalEvent } from "@core/entities/HistoricalEvent";
import { ExtractFnReturnType, QueryConfig } from "@web/lib/react-query";

export const getEvents = async ({
  topic,
  token,
}: {
  topic: string;
  token: string | null;
}) => {
  if (!token) return [] as HistoricalEvent[];

  const events = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
    method: "POST",
    body: JSON.stringify({ topic }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res as HistoricalEvent[])
    .catch((e) => {
      console.error(e);
      return [] as HistoricalEvent[];
    });

  console.log("events", events);

  return events;
};

type QueryFnType = typeof getEvents;

type UseEventsOptions = Parameters<typeof getEvents>[0] & {
  config?: QueryConfig<QueryFnType>;
};

export const useEvents = ({ config, token, topic }: UseEventsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["events", topic],
    queryFn: () =>
      getEvents({
        topic,
        token,
      }),
  });
};
