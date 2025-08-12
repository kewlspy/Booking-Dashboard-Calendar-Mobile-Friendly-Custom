import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FaShuttleVan } from "react-icons/fa";
import { isSameDay } from "../utils/dateHelpers";

const DraggableBooking = ({ booking, date, onBookingClick, dragOperation }) => {
  const {
    attributes: startAttributes,
    listeners: startListeners,
    setNodeRef: setStartNodeRef,
    transform: startTransform,
    isDragging: isStartDragging,
  } = useDraggable({
    id: `${booking.id}-start`,
    data: { booking, date, type: "start" },
  });

  const {
    attributes: endAttributes,
    listeners: endListeners,
    setNodeRef: setEndNodeRef,
    transform: endTransform,
    isDragging: isEndDragging,
  } = useDraggable({
    id: `${booking.id}-end`,
    data: { booking, date, type: "end" },
  });

  const isStart = isSameDay(new Date(booking.startDate), date);
  const isEnd = isSameDay(new Date(booking.endDate), date);

  const startStyle = {
    transform: startTransform
      ? `translate3d(${startTransform.x}px, ${startTransform.y}px, 0)`
      : undefined,
  };

  const endStyle = {
    transform: endTransform
      ? `translate3d(${endTransform.x}px, ${endTransform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      onClick={() => onBookingClick(booking)}
      className={`flex flex-col justify-center align-center items-center px-1 py-1 text-xs rounded cursor-pointer
         ${isStart ? "bg-green-200" : "bg-red-200"}`}
    >
      <div className="flex justify-center sm:justify-between w-full">
        {(isStart || date === null) && (
          <div
            ref={setStartNodeRef}
            style={startStyle}
            {...startAttributes}
            {...startListeners}
            className="cursor-grab active:cursor-grabbing bg-green-400 rounded-full p-1 z-10"
            title="Drag to change start date"
          >
            <FaShuttleVan data-testid="shuttle-icon" className="text-white" />
          </div>
        )}
        {(isEnd || date === null) && (
          <div
            ref={setEndNodeRef}
            style={endStyle}
            {...endAttributes}
            {...endListeners}
            className="cursor-grab active:cursor-grabbing bg-red-400 rounded-full p-1 z-10"
            title="Drag to change end date"
          >
            <FaShuttleVan
              data-testid="shuttle-icon"
              className="text-white transform scale-x-[-1]"
            />
          </div>
        )}
      </div>
      <div className="hidden sm:inline text-[10px] font-semibold text-teal-700 text-center break-words text-xs px-2">
        {booking.customerName.toUpperCase()}
      </div>
      <div className="sm:inline sm:rounded sm:bg-transparent text-teal-700 text-center break-words text-xs px-2">
        ID: {booking.id}
      </div>
      <div className="hidden sm:inline text-[10px] text-gray-500">
        {new Date(booking.startDate).toLocaleDateString()} <br />
        {new Date(booking.endDate).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DraggableBooking;
