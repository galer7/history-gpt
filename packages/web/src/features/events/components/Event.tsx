import { HistoricalEvent } from "@core/entities/HistoricalEvent";
import clsx from "clsx";

function Event({
  event,
  isOpen,
  onClick,
}: {
  event: HistoricalEvent;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      key={event.title}
      onClick={onClick}
      className={clsx(
        "w-full max-w-40 p-4 my-2 bg-white rounded-md shadow-md cursor-pointer inline-block",
        !isOpen ? "opacity-50" : ""
      )}
    >
      <h3 className="text-md font-bold">{event.title}</h3>
      {isOpen && (
        <>
          <p className="text-sm italic">{event.date}</p>
          <p className="text-sm">{event.description}</p>
        </>
      )}
    </div>
  );
}

export default Event;
