export interface HistoricalEvent {
  lat: number;
  lon: number;
  date: string;
  title: string;
  description: string;
}

export interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}
