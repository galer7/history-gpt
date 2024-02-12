import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

import {
  useArcsSoFar,
  useCurrentEvent,
  useEvents,
} from "./features/events/api/getEvents";
import { clsx } from "./lib/clsx";
import EventsList from "./features/events/components/EventsList";
import Carousel from "./components/Carousel";

function App() {
  const globEl = useRef<GlobeMethods>();
  const [topic, setTopic] = useState("");
  const {
    refetch,
    data: events,
    isLoading,
  } = useEvents({
    topic,
    config: { enabled: false },
  });
  const { currentEventIndex, handleNext, handlePrev } = useCurrentEvent(
    events || []
  );
  const arcs = useArcsSoFar(events || [], currentEventIndex);
  const [ringData, setRingData] = useState({} as { lat: number; lng: number });

  useEffect(() => {
    if (events) return;

    const globe = globEl.current;
    if (!globe) return;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = -0.35;
  }, [events]);

  useEffect(() => {
    if (!events) return;

    const isSameLatLon =
      ringData.lat === events[currentEventIndex].lat &&
      ringData.lng === events[currentEventIndex].lon;

    if (isSameLatLon) return;

    setRingData({
      lat: events[currentEventIndex].lat,
      lng: events[currentEventIndex].lon,
    });
  }, [events, currentEventIndex, ringData]);

  const handleSearch = () => {
    refetch().then(() => {
      const globe = globEl.current;
      if (!globe) return;

      globe.controls().autoRotate = false;
      globe.controls().autoRotateSpeed = 0;

      if (!events) return;
      const { lat, lon } = events[0];
      globe.pointOfView({ lat: lat - 20, lng: lon, altitude: 2 });
    });
  };

  const windowWidth = window.innerWidth;

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
          onClick={() => handleSearch()}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
      {/* events list will sit on the right side of the globe */}
      <div className="absolute right-0 z-10">
        {events && <EventsList events={[events[currentEventIndex]]} />}
      </div>
      {/* buttons to navigate through events. put it in the bottom middle */}
      {events && (
        <div className="absolute bottom-0 z-10 w-full">
          <Carousel
            onLeftClick={handlePrev}
            onRightClick={handleNext}
            isFirst={currentEventIndex === 0}
            isLast={currentEventIndex === (events?.length || 0) - 1}
          />
        </div>
      )}
      <Globe
        ref={globEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        arcsData={arcs}
        ringsData={[ringData]}
        width={windowWidth}
      />
    </main>
  );
}

export default App;
