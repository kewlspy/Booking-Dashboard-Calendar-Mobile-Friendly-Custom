import React from "react";
import { useState, useEffect } from "react";
import Autocomplete from "../components/Autocomplete";
import { ImCross } from "react-icons/im";
import { FaShuttleVan } from "react-icons/fa";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2?.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function DashboardView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStationData, setSelectedStationData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetching all data at once
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://605c94c36d85de00170da8b4.mockapi.io/stations"
        );
        const json = await res.json();
        setData(json);
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
          </div>
          <button
            onClick={goToNextMonth}
            className="flex items-center cursor-pointer justify-center w-10 h-10  bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full pb-1 pl-1 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ring-2 ring-teal-300"
          >
            &gt;
          </button>
        </div>

        {/* Calendar View */}
        <div
          data-testid="calendar-grid"
          className="grid grid-cols-7 gap-2 sm:gap-4"
        >
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center font-bold text-gray-600 border-b pb-2"
            >
              {day}
            </div>
          ))}
          {daysArray.map((date, idx) => {
            const bookings =
              selectedStationData?.bookings?.filter((b) => {
                const start = new Date(b.startDate);
                const end = new Date(b.endDate);
                return isSameDay(start, date) || isSameDay(end, date);
              }) || [];

            return (
              <div
                key={idx}
                className="bg-teal-50 rounded-lg p-2 min-h-[100px] flex flex-col shadow hover:scale-105 transition"
              >
                <div className="font-bold text-gray-700">{date?.getDate()}</div>
                <div className="mt-1 flex flex-col gap-1">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`flex flex-col justify-center align-center items-center px-1 py-1 text-xs rounded cursor-pointer
                         ${
                           isSameDay(new Date(b.startDate), date)
                             ? "bg-green-200"
                             : "bg-red-200"
                         }`}
                    >
                      {isSameDay(new Date(b.startDate), date) ? (
                        <FaShuttleVan
                          data-testid="shuttle-icon"
                          className="text"
                        />
                      ) : (
                        <FaShuttleVan
                          data-testid="shuttle-icon"
                          className="transform scale-x-[-1]"
                        />
                      )}
                      <div className="hidden sm:inline text-[10px] font-semibold text-teal-700 text-center break-words text-xs  px-2">
                        {b.customerName.toUpperCase()}
                      </div>
                      <div className="sm:inline sm:rounded sm:bg-transparent  text-teal-700 text-center break-words text-xs px-2">
                        ID: {b.id}
                      </div>
                      <div className="hidden sm:inline text-[10px] text-gray-500">
                        {new Date(b.startDate).toLocaleDateString()} <br />
                        {new Date(b.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="flex flex-col justify-center align-center items-center text-xs text-gray-300">
                      <ImCross className=" text-red-600 mr-1" />
                      <span className="hidden sm:inline">No bookings</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
