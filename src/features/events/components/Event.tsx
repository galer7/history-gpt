import { HistoricalEvent } from "../types";

function Event({ date, description, title }: HistoricalEvent) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{date}</p>
      <p>{description}</p>
    </div>
  );
}

export default Event;
