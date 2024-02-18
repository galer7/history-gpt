import { HistoricalEvent } from "@core/entities/HistoricalEvent";
import Event from "@web/features/events/components/Event";

interface EventsListProps {
  events: HistoricalEvent[];
  currentEventIndex: number;
  setCurrentEventIndex: (index: number) => void;
}

function EventsList({
  events,
  currentEventIndex,
  setCurrentEventIndex,
}: EventsListProps) {
  return (
    <div className="flex flex-col items-center w-full h-screen pr-4">
      <div className="flex flex-col items-center w-full h-screen overflow-y-scroll max-h-screen">
        {events.map((event, index) => (
          <Event
            key={event.title}
            event={event}
            isOpen={index === currentEventIndex}
            onClick={() => {
              setCurrentEventIndex(index);
              console.log("setCurrentEventIndex", index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default EventsList;
