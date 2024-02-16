import { HistoricalEvent } from "@core/entities/HistoricalEvent";

export interface LanguageModelService {
  getHistoricalEvents(topic: string): Promise<HistoricalEvent[]>;
}
