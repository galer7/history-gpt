import { HistoricalEvent } from "../types";
import Event from "./Event";

function EventsList({ events }: { events: HistoricalEvent[] }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="font-bold">Historical Events</h2>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {events.map((event) => (
          <Event key={event.title} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventsList;
