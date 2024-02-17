import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { HistoricalEvent } from "@core/entities/HistoricalEvent";
import { ExtractFnReturnType, QueryConfig } from "@web/lib/react-query";

export const getEvents = async (topic: string, token: string) => {
  const events = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
    method: "POST",
    body: JSON.stringify({ topic }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res as HistoricalEvent[]);

  console.log("events", events);

  return events;
};

type QueryFnType = typeof getEvents;

type UseEventsOptions = {
  topic: string;
  token: string;
  config?: QueryConfig<QueryFnType>;
};

export const useEvents = ({ config, token, topic }: UseEventsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["events", topic],
    queryFn: () => getEvents(topic, token),
  });
};

export const useCurrentEvent = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  return {
    currentEventIndex,
    setCurrentEventIndex,
  };
};

export const computeArc = (
  events: HistoricalEvent[],
  currentEventIndex: number
) => {
  return currentEventIndex === 0
    ? {}
    : {
        startLat: events[currentEventIndex - 1].lat,
        startLng: events[currentEventIndex - 1].lon,
        endLat: events[currentEventIndex].lat,
        endLng: events[currentEventIndex].lon,
      };
};
