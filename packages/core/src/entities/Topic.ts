import { HistoricalEvent } from "@core/entities/HistoricalEvent";

export interface Topic {
  name: string;
  description: string;
  events: HistoricalEvent[];
}
