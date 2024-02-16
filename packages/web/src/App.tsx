import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import clsx from "clsx";

import {
  computeArc,
  useCurrentEvent,
  useEvents,
} from "@web/features/events/api/getEvents";
import EventsList from "@web/features/events/components/EventsList";

function App() {
  const globEl = useRef<GlobeMethods>();
  const [newTopic, setNewTopic] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const {
    refetch,
    data: events,
    isLoading,
  } = useEvents({
    topic: newTopic,
    config: { enabled: false },
  });
  const { currentEventIndex, setCurrentEventIndex } = useCurrentEvent();
  const arc = computeArc(events || [], currentEventIndex);
  const [ringData, setRingData] = useState({} as { lat: number; lng: number });

  useEffect(() => {
    if (events) return;

    const globe = globEl.current;
    if (!globe) return;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = -0.35;
  }, [events]);

  window.addEventListener("resize", () => {
    const globe = globEl.current;
    if (!globe) return;

    setWindowWidth(window.innerWidth);
  });

  useEffect(() => {
    console.log("currentEventIndex", currentEventIndex);
    if (!events) return;

    const globe = globEl.current;
    if (!globe) return;

    const isSameLatLon =
      ringData.lat === events[currentEventIndex].lat &&
      ringData.lng === events[currentEventIndex].lon;

    console.log("ringData", ringData);
    console.log("events[currentEventIndex]", events[currentEventIndex]);
    console.log("isSameLatLon", isSameLatLon);

    if (isSameLatLon) return;

    setRingData({
      lat: events[currentEventIndex].lat,
      lng: events[currentEventIndex].lon,
    });

    globe.pointOfView({
      lat: events[currentEventIndex].lat - 20,
      lng: events[currentEventIndex].lon,
      altitude: 2,
    });
  }, [currentEventIndex, events, ringData]);

  const handleSearch = () => {
    refetch().then(() => {
      const globe = globEl.current;
      if (!globe) return;

      globe.controls().autoRotate = false;
      globe.controls().autoRotateSpeed = 0;
    });
  };

  const isButtonDisabled = !newTopic || isLoading;

  return (
    <main>
      {/* div for title. put in the top middle */}
      <div className="absolute top-0 z-10 w-full text-center p-4">
        <h1 className="text-white text-5xl">History GPT</h1>
      </div>
      {/* div for topic. put on the left side of the globe */}
      <div></div>
      {/* div for search bar. put in the bottom middle */}
      <div className="absolute bottom-0 z-10 w-full text-center p-4">
        <input
          className={clsx(
            "border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none",
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-gray-400"
          )}
          type="text"
          placeholder="Search for a topic"
          onChange={(e) => setNewTopic(e.target.value)}
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
        {events && (
          <EventsList
            events={events}
            currentEventIndex={currentEventIndex}
            setCurrentEventIndex={setCurrentEventIndex}
          />
        )}
      </div>
      <Globe
        ref={globEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        arcsData={arc}
        ringsData={[ringData]}
        width={windowWidth}
        animateIn={false}
      />
    </main>
  );
}

export default App;
