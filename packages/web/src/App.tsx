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
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const [, setLoading] = useState(true);
  const [session, setSession] = useState<{
    userId: string;
    email: string;
    picture: string;
    name: string;
  } | null>(null);

  const getSession = async () => {
    const token = localStorage.getItem("session");
    if (token) {
      const user = await getUserInfo(token);

      console.log("user", user);
      if (user) setSession(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("session", token);
      window.location.replace(window.location.origin);
    }
  }, []);

  const getUserInfo = async (session: string) => {
    try {
      return await fetch(`${import.meta.env.VITE_API_URL}/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json() as Promise<{
              userId: string;
              email: string;
              picture: string;
              name: string;
            }>;
          }

          throw new Error("Something went wrong");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      alert(error);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("session");
    setSession(null);
  };
  const [ringData, setRingData] = useState({} as { lat: number; lng: number });
  const [arcData, setArcData] = useState(
    {} as {
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
    }
  );

  useEffect(() => {
    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("session", token);
      window.location.replace(window.location.origin);
    }
  }, []);

  const { data: events, isLoading } = useEvents({
    topic,
    token: localStorage.getItem("session") || "",
    config: { refetchOnWindowFocus: false, enabled: !!topic },
  });
  const { currentEventIndex, setCurrentEventIndex } = useCurrentEvent();

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
    setWindowHeight(window.innerHeight);
  });

  useEffect(() => {
    console.log("currentEventIndex", currentEventIndex);
    if (!events) return;

    const globe = globEl.current;
    if (!globe) return;

    const isSameLatLon =
      ringData.lat === events[currentEventIndex].lat &&
      ringData.lng === events[currentEventIndex].lon;

    if (isSameLatLon) return;

    setRingData({
      lat: events[currentEventIndex].lat,
      lng: events[currentEventIndex].lon,
    });

    setArcData(
      computeArc(events || [], currentEventIndex) as {
        startLat: number;
        startLng: number;
        endLat: number;
        endLng: number;
      }
    );

    globe.pointOfView({
      lat: events[currentEventIndex].lat - 20,
      lng: events[currentEventIndex].lon,
      altitude: 2,
    });
  }, [currentEventIndex, events, ringData]);

  const handleSearch = () => {
    setTopic(input);

    setRingData({} as { lat: number; lng: number });
    setArcData(
      {} as {
        startLat: number;
        startLng: number;
        endLat: number;
        endLng: number;
      }
    );
    setCurrentEventIndex(0);
  };

  if (events) {
    const globe = globEl.current;
    if (!globe) return;

    globe.controls().autoRotate = false;
    globe.controls().autoRotateSpeed = 0;
  }

  const isButtonDisabled = !input || isLoading;

  return (
    <main>
      <div className="absolute top-0 left-0 z-30 p-4">
        {session ? (
          <div>
            <img
              className="h-10 w-10 rounded-full"
              src={session.picture}
              alt="profile picture"
            />
            <p className="text-white">Hello, {session.name}</p>
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_URL
              }/auth/google/authorize`;
            }}
          >
            Sign In
          </button>
        )}
      </div>

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
          onChange={(e) => setInput(e.target.value)}
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
        arcsData={[arcData]}
        ringsData={[ringData]}
        width={windowWidth}
        height={windowHeight}
        animateIn={false}
      />
    </main>
  );
}

export default App;
