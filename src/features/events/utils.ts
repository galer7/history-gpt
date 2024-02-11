import { Arc, HistoricalEvent } from "./types";

export const computeArcsFromEvents = (events: HistoricalEvent[]) => {
  return events
    .map((event, index) => {
      const nextEvent = events[index + 1];

      if (!nextEvent) {
        return null;
      }

      return {
        startLat: event.lat,
        startLng: event.lon,
        endLat: nextEvent.lat,
        endLng: nextEvent.lon,
      };
    })
    .filter((arc: Arc | null): arc is Arc => arc !== null);
};
