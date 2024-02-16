export const getTopics = async () => {
  if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
    return getMockTopics();
  }

  throw new Error("Not implemented");
};

function getMockTopics() {
  return ["Life of Henri Coanda"];
}
