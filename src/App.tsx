import { useRef, useState } from "react";
import Globe from "react-globe.gl";

import { useEvents } from "./features/events/api/getEvents";
import { clsx } from "./lib/clsx";
import EventsList from "./features/events/components/EventsList";
import { computeArcsFromEvents } from "./features/events/utils";

function App() {
  const globEl = useRef();
  const [topic, setTopic] = useState("");
  const {
    refetch,
    data: events,
    isLoading,
  } = useEvents({
    topic,
    config: { enabled: false },
  });

  const isButtonDisabled = !topic || isLoading;

  return (
    <main>
      <div className="absolute z-10">
        <h1 className="text-white">History GPT</h1>
        <input
          className={clsx(
            "border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none",
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-gray-400"
          )}
          type="text"
          placeholder="Search for a topic"
          onChange={(e) => setTopic(e.target.value)}
          autoComplete="on"
        ></input>
        <button
          className={clsx(
            "bg-blue-500 text-white font-bold py-2 px-4 rounded",
            isButtonDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          )}
          onClick={() => refetch()}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
      {/* events list will sit on the right side of the globe */}
      <div className="absolute right-0 z-10">
        {events && <EventsList events={events} />}
      </div>
      <Globe
        ref={globEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        arcsData={events ? computeArcsFromEvents(events) : []}
      />
    </main>
  );
}

export default App;
