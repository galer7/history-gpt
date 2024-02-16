import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ExtractFnReturnType, QueryConfig } from "../../../lib/react-query";
import { HistoricalEvent } from "../types";
import { getEventsFromLLM } from "../../../lib/openai";

export const getEvents = async (topic: string) => {
  if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
    return getMockEvents();
  }

  const response = await getEventsFromLLM(topic);

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

function getMockEvents() {
  return [
    {
      lat: 44.4301,
      lon: 26.094,
      date: "1886",
      title: "Birth",
      description: "Henri Coanda is born in Bucharest, Romania.",
    },
    {
      lat: 44.4301,
      lon: 26.094,
      date: "1897",
      title: "Education",
      description:
        "Coanda attends the Nicolae Rosetti High School in Bucharest.",
    },
    {
      lat: 44.4414,
      lon: 26.0938,
      date: "1904",
      title: "Polytechnic School",
      description:
        "Coanda enrolls in the School of Electrical Engineering at the Polytechnic School in Bucharest.",
    },
    {
      lat: 45.7605,
      lon: 21.2265,
      date: "1907",
      title: "Engineering School in Paris",
      description: "Coanda moves to Paris to attend the School of Engineering.",
    },
    {
      lat: 48.8584,
      lon: 2.2945,
      date: "1910",
      title: "Engineer's Degree",
      description:
        "Coanda earns his engineer's degree at the School of Engineering in Paris.",
    },
    {
      lat: 48.8584,
      lon: 2.2945,
      date: "1910",
      title: "Discovery of the Coanda Effect",
      description:
        "While working on aeronautical experiments, Coanda discovers the Coanda Effect, which becomes the foundation of his future work in aviation.",
    },
    {
      lat: 48.8584,
      lon: 2.2945,
      date: "1910",
      title: "Prototype Aircraft",
      description:
        "Coanda builds and flies the world's first jet-powered aircraft, known as the Coandă-1910, based on his Coanda Effect discovery.",
    },
    {
      lat: 44.4301,
      lon: 26.094,
      date: "1920",
      title: "Founder of the Coanda-1910 Airplane Factory",
      description:
        "Coanda founds the Coanda-1910 Airplane Factory in Bucharest, Romania.",
    },
    {
      lat: 44.4325,
      lon: 26.1039,
      date: "1935",
      title: "Chief Scientist at the British Marconi Company",
      description:
        "Coanda becomes the Chief Scientist at the British Marconi Company in London, England.",
    },
    {
      lat: 44.468,
      lon: 26.0745,
      date: "1949",
      title: "Return to Romania",
      description:
        "Coanda returns to Romania and is appointed as the Director General of the Institute for Scientific and Technical Creation in Bucharest.",
    },
    {
      lat: 44.4301,
      lon: 26.094,
      date: "1972",
      title: "Death",
      description:
        "Henri Coanda passes away in Bucharest, Romania at the age of 85.",
    },
  ];
}

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
    ? []
    : [
        {
          startLat: events[currentEventIndex - 1].lat,
          startLng: events[currentEventIndex - 1].lon,
          endLat: events[currentEventIndex].lat,
          endLng: events[currentEventIndex].lon,
        },
      ];
};
