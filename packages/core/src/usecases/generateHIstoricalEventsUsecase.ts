import { LanguageModelService } from "@core/boundaries/LanguageModelService";

interface Dependencies {
  languageModelService: LanguageModelService;
}

interface Input {
  topic: string;
}

export const generateHistoricalEventsUsecase =
  ({ languageModelService }: Dependencies) =>
  async ({ topic }: Input) => {
    return await languageModelService.getHistoricalEvents(topic);
  };
