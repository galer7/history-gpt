import { useEffect, useState } from "react";

import { useEvents } from "@web/features/events/api/getEvents";
import EventsList from "@web/features/events/components/EventsList";
import User from "@web/features/user/components/User";
import GlobeWithData from "@web/features/globe/components/Globe";
import UserPrompt from "@web/features/prompt/components/UserPrompt";
import { getToken } from "@web/utils/getToken";
import { useUserV2 } from "./features/user/api/getUser";

function App() {
  const [topic, setTopic] = useState("");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const token = getToken();

  const {
    isPending: isUserLoading,
    data: user,
    reset: resetUser,
    mutate,
  } = useUserV2({
    token,
  });

  useEffect(() => {
    if (token) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: events, isLoading: areEventsLoading } = useEvents({
    topic,
    token,
    config: { refetchOnWindowFocus: false, enabled: !!topic },
  });

  return (
    <main>
      <div className="absolute top-0 left-0 z-30 p-4">
        <User user={user} isUserLoading={isUserLoading} resetUser={resetUser} />
      </div>

      <div className="absolute top-0 z-10 w-full text-center p-4">
        <h1 className="text-white text-5xl">History GPT</h1>
      </div>
      <div className="absolute bottom-0 z-10 w-full text-center p-4">
        <UserPrompt
          setTopic={setTopic}
          setCurrentEventIndex={setCurrentEventIndex}
          areEventsLoading={areEventsLoading}
          user={user}
          isUserLoading={isUserLoading}
        />
      </div>
      <div className="absolute right-0 z-10">
        {events && (
          <EventsList
            events={events}
            currentEventIndex={currentEventIndex}
            setCurrentEventIndex={setCurrentEventIndex}
          />
        )}
      </div>

      <GlobeWithData events={events} currentEventIndex={currentEventIndex} />
    </main>
  );
}

export default App;
