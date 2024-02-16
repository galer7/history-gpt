import { clsx } from "../lib/clsx";

export default function Carousel({
  onLeftClick,
  onRightClick,
  isFirst,
  isLast,
}: {
  onLeftClick: () => void;
  onRightClick: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center justify-center w-full">
      <button
        onClick={onLeftClick}
        className={clsx(
          "p-2 m-2 text-white rounded-full",
          isFirst ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
        )}
      >
        Prev
      </button>
      <button
        onClick={onRightClick}
        className={clsx(
          "p-2 m-2 text-white rounded-full",
          isLast ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
        )}
      >
        Next
      </button>
    </div>
  );
}
