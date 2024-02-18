import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

import { HistoricalEvent } from "@core/entities/HistoricalEvent";

interface GlobeProps {
  events: HistoricalEvent[] | undefined;
  currentEventIndex: number;
}

interface Ring {
  lat: number;
  lng: number;
}

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

export default function GlobeWithData({
  events,
  currentEventIndex,
}: GlobeProps) {
  const globEl = useRef<GlobeMethods>();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // update window width and height on resize
  window.addEventListener("resize", () => {
    const globe = globEl.current;

    if (!globe) return;

    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  });

  // make globe rotate when no events are present
  useEffect(() => {
    const globe = globEl.current;

    if (!globe) return;
    if (events) {
      globe.controls().autoRotate = false;
      return;
    }

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = -0.35;
  });

  // make globe POV change on current event when events are present
  useEffect(() => {
    const globe = globEl.current;

    if (!globe) return;
    if (!events) return;

    globe.pointOfView({
      lat: events[currentEventIndex].lat - 20,
      lng: events[currentEventIndex].lon,
      altitude: 2,
    });
  }, [currentEventIndex, events]);

  const { ring, arc } = useMemo<{
    ring: Ring | null;
    arc: Arc | null;
  }>(() => {
    if (!events) return { ring: null, arc: null };

    const isSameLatLon =
      currentEventIndex === 0 ||
      (events[currentEventIndex].lat === events[currentEventIndex - 1].lat &&
        events[currentEventIndex].lon === events[currentEventIndex - 1].lon);

    const arc = isSameLatLon
      ? null
      : {
          startLat: events[currentEventIndex - 1].lat,
          startLng: events[currentEventIndex - 1].lon,
          endLat: events[currentEventIndex].lat,
          endLng: events[currentEventIndex].lon,
        };

    const ring = {
      lat: events[currentEventIndex].lat,
      lng: events[currentEventIndex].lon,
    };

    return { ring, arc };
  }, [events, currentEventIndex]);

  const rings = ring ? [ring] : [];
  const arcs = arc ? [arc] : [];

  return (
    <Globe
      ref={globEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      arcsData={arcs}
      ringsData={rings}
      width={windowWidth}
      height={windowHeight}
      animateIn={false}
    />
  );
}
