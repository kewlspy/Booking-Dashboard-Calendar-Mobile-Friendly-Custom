import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { ImCross } from "react-icons/im";
import DraggableBooking from "./DraggableBooking";

const DroppableDay = ({ date, bookings, onBookingClick, dragOperation }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date?.toISOString(),
    data: { date },
  });

  // Determine highlight color based on drag operation
  const getHighlightColor = () => {
    if (!isOver || !dragOperation) return "";
    console.log("Highlight for operation:", dragOperation);
    return dragOperation === "start"
      ? "ring-2 ring-green-400 bg-green-100"
      : "ring-2 ring-red-400 bg-red-100";
  };

  if (!date) {
    return (
      <div className="bg-gray-50 rounded-lg p-2 min-h-[100px] flex flex-col" />
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver ? getHighlightColor() : "bg-teal-50"
      } rounded-lg p-2 min-h-[100px] flex flex-col shadow hover:scale-105 transition`}
    >
      <div className="font-bold text-gray-700">{date.getDate()}</div>
      <div className="mt-1 flex flex-col gap-1">
        {bookings.map((b) => (
          <DraggableBooking
            key={b.id}
            booking={b}
            date={date}
            onBookingClick={onBookingClick}
            dragOperation={dragOperation}
          />
        ))}
        {bookings.length === 0 && (
          <div className="flex flex-col justify-center items-center text-xs text-gray-300">
            <ImCross className="text-red-600 mr-1" />
            <span className="hidden sm:inline">No bookings</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppableDay;
