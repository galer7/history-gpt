import { HistoricalEvent } from "../types";

function EventsList({ events }: { events: HistoricalEvent[] }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="font-bold">Historical Events</h2>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {events.map((event) => (
          <div
            key={event.title}
            className="w-full max-w-40 p-4 my-2 bg-white rounded-md shadow-md"
          >
            <h3 className="text-md font-bold">{event.title}</h3>
            <p className="text-sm italic">{event.date}</p>
            <p className="text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
