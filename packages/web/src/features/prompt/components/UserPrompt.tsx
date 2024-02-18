import clsx from "clsx";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

import { User } from "@core/entities/User";

interface UserPromptProps {
  setTopic: (topic: string) => void;
  setCurrentEventIndex: (index: number) => void;
  areEventsLoading: boolean;
  user: User | null | undefined;
  isUserLoading: boolean;
}

export default function UserPrompt({
  setTopic,
  setCurrentEventIndex,
  areEventsLoading,
  user,
  isUserLoading,
}: UserPromptProps) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    setTopic(input);
    setCurrentEventIndex(0);
  };

  const isButtonDisabled = !user || !input || areEventsLoading || isUserLoading;
  const isUserLoggedIn = user && !isUserLoading;

  console.log("user", user);
  console.log("isUserLoading", isUserLoading);

  return (
    <>
      <input
        className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
        type="text"
        placeholder="Search for a topic"
        onChange={(e) => setInput(e.target.value)}
        autoComplete="on"
      ></input>
      <a
        data-tooltip-id="login-first-tooltip"
        data-tooltip-content="You should login first"
        data-tooltip-place="top"
      >
        <button
          className={clsx(
            "bg-blue-500 text-white font-bold py-2 px-4 rounded",
            isButtonDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          )}
          disabled={isButtonDisabled}
          onClick={() => handleSearch()}
        >
          Search
        </button>
      </a>

      {!isUserLoggedIn && <Tooltip id="login-first-tooltip" />}
    </>
  );
}
