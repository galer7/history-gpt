import { HistoricalEvent } from "../types";

function Event({ event }: { event: HistoricalEvent }) {
  return (
    <div
      key={event.title}
      className="w-full max-w-40 p-4 my-2 bg-white rounded-md shadow-md"
    >
      <h3 className="text-md font-bold">{event.title}</h3>
      <p className="text-sm italic">{event.date}</p>
      <p className="text-sm">{event.description}</p>
    </div>
  );
}

export default Event;
