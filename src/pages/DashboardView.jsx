import React from "react";
import { useState, useEffect } from "react";
import Autocomplete from "../components/Autocomplete";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MdSaveAs } from "react-icons/md";
import DroppableDay from "../components/DroppableDay";
import { isSameDay } from "../utils/dateHelpers";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export default function DashboardView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStationData, setSelectedStationData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dragOperation, setDragOperation] = useState(null); // 'start' or 'end'

  const mockData = [
    {
      id: "1",
      name: "Berlin",
      bookings: [
        {
          id: "1",
          stationId: "1",
          customerName: "Kera",
          startDate: "2025-08-05T10:00:00.000Z",
          endDate: "2025-08-06T10:00:00.000Z",
        },
      ],
    },
    {
      id: "2",
      name: "Hamburg",
      bookings: [
        {
          id: "2",
          stationId: "2",
          customerName: "John",
          startDate: "2025-08-10T10:00:00.000Z",
          endDate: "2025-08-15T10:00:00.000Z",
        },
      ],
    },
  ];

  // Fetching all data at once
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://605c94c36d85de00170da8b4.mockapi.io/stations"
        );
        const json = await res.json();
        setData(json);
        // setData(mockData); // Using mock data for now
        console.log("booking data", data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
      }
    }
    fetchData();
  }, []);

  async function fetchSuggestions(query) {
    if (!query) return [];
    return Promise.resolve(
      data.filter((station) =>
        station.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
  // Filter data when station changes
  useEffect(() => {
    if (selectedStation) {
      const stationData = data.find((s) => s.id === selectedStation.id);
      setSelectedStationData(stationData || null);
    }
  }, [selectedStation, data]);

  function goToPrevMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }

  function goToToday() {
    setCurrentMonth(new Date());
  }

  function generateMonthGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = firstDay.getDay(); // 0=Sun, 6=Sat

    // Convert Sunday (0) to 6 to make Monday first (1 becomes 0, ..., 6 becomes 5, 0 becomes 6)
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const daysArray = [];

    // Add empty slots before the first day
    for (let i = 0; i < offset; i++) {
      daysArray.push(null);
    }

    // Add actual days of month
    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push(new Date(year, month, d));
    }

    // Fill remaining slots to make full weeks (multiple of 7)
    while (daysArray.length % 7 !== 0) {
      daysArray.push(null);
    }

    return daysArray;
  }
  const daysArray = generateMonthGrid(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );
  // Drag and drop functions

  //Sensors for mouse, touch, and keyboard support
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  // Helper: Determine updated start and end dates

  const getUpdatedBookingDates = (booking, type, newDate) => {
    let startDate = new Date(booking.startDate);
    let endDate = new Date(booking.endDate);
    console.log("getUpdatedBookingDates called", startDate);

    if (type === "start") {
      startDate = newDate;
      // Ensure end date is after start date
      if (startDate > endDate) {
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
      }
    } else if (type === "end") {
      endDate = newDate;
      // Ensure end date is after start date
      if (endDate < startDate) {
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
      }
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  // Main drag handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    console.log("Drag ended:", active, "over:", over.id);

    const [bookingId, type] = active.id.split("-"); // type = 'start' or 'end'
    const newDate = new Date(over.id);
    console.log("Drag started with type:", type);

    setData((prev) =>
      prev.map((station) => ({
        ...station,
        bookings: station.bookings.map((b) => {
          if (b.id === bookingId) {
            const updatedDates = getUpdatedBookingDates(b, type, newDate);
            return {
              ...b,
              ...updatedDates,
            };
          }
          return b;
        }),
      }))
    );

    setDragOperation(null);
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-teal-50 to-white">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">
          Booking Dashboard
        </h1>

        {/* Station Select */}
        <div className="mb-6 max-w-md mx-auto">
          <Autocomplete
            fetchSuggestions={fetchSuggestions}
            onSelect={setSelectedStation}
            getSuggestionLabel={(s) => s.name}
            placeholder="Select a station..."
          />
          {selectedStation && (
            <div className="mt-3 font-semibold text-center text-teal-600">
              Selected station: {selectedStation.name}
            </div>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={goToPrevMonth}
            className="flex items-center cursor-pointer justify-center w-10 h-10  bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full pb-1 pr-1 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ring-2 ring-teal-300"
          >
            &lt;
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={goToToday}
              className="px-4 py-1 text-sm bg-teal-100 hover:bg-teal-200 text-teal-700 font-medium rounded-full shadow transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Today
            </button>
            <span className="text-lg font-medium text-gray-700">
              {currentMonth.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button 
              // onClick={goToToday}
              className=" flex items-center px-4 py-1 text-sm bg-teal-700 hover:bg-teal-900 text-white font-medium rounded-full shadow transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              <MdSaveAs className="flex justify-center" />
              <span className="px-1"> Update</span>
            </button>
          </div>
          <button
            onClick={goToNextMonth}
            className="flex items-center cursor-pointer justify-center w-10 h-10  bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full pb-1 pl-1 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ring-2 ring-teal-300"
          >
            &gt;
          </button>
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {/* Weekdays Header */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center font-bold text-gray-600 border-b pb-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {daysArray.map((date, idx) => {
              const bookings =
                selectedStationData?.bookings?.filter((b) => {
                  const start = new Date(b.startDate);
                  const end = new Date(b.endDate);
                  return isSameDay(start, date) || isSameDay(end, date);
                }) || [];

              return (
                <DroppableDay
                  key={idx}
                  date={date}
                  bookings={bookings}
                  onBookingClick={(b) => setSelectedBooking(b)}
                />
              );
            })}
          </div>
        </DndContext>
      </div>
      {/* Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-teal-700 mb-4">
              Booking Details
            </h2>

            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p className="justify-between flex">
                <span className="font-medium">Name:</span>
                <span className="text-teal-600 font-bold">
                  {selectedBooking.customerName.toUpperCase()}
                </span>
              </p>
              <p className="justify-between flex">
                <span className="font-medium">Start:</span>{" "}
                {new Date(selectedBooking.startDate).toLocaleString()}
              </p>
              <p className="justify-between flex">
                {" "}
                <span className="font-medium">End:</span>{" "}
                {new Date(selectedBooking.endDate).toLocaleString()}
              </p>
              {selectedBooking.pickupStation && (
                <p className="justify-between flex">
                  <span className="font-medium">Pickup Station:</span>
                  <span className="text-teal-600 font-bold">
                    {selectedBooking.pickupStation}
                  </span>
                </p>
              )}
              {selectedBooking.returnStation && (
                <p className="justify-between flex">
                  <span className="font-medium">Return Station:</span>{" "}
                  <span className="text-teal-600 font-bold">
                    {selectedBooking.returnStation}
                  </span>{" "}
                </p>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 cursor-pointer py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition shadow focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Back
              </button>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className=" h-5 w-5 absolute top-2 right-2 flex items-center justify-center cursor-pointer hover:bg-teal-400 rounded-2xl text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}{" "}
    </div>
  );
}
