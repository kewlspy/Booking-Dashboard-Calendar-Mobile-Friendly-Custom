import React from "react";
import { render, screen, within, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardView from "./DashboardView";

// Mock fetch globally
global.fetch = jest.fn();

describe("DashboardView", () => {
  const mockData = [
    {
      id: "1",
      name: "Berlin Station",
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
      name: "Hamburg Station",
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

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
  });

  test("renders month view with weekday headers", () => {
    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    const weekdays = screen.getAllByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/);
    expect(weekdays).toHaveLength(7);
    expect(weekdays[0]).toHaveTextContent("Mon");
    expect(weekdays[6]).toHaveTextContent("Sun");
  });

  test("fetches and displays stations data", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <DashboardView />
        </MemoryRouter>
      );
    });

    // Verify API call was made
    expect(fetch).toHaveBeenCalledWith(
      "https://605c94c36d85de00170da8b4.mockapi.io/stations"
    );

    // Type in the autocomplete to trigger suggestions
    const autocomplete = screen.getByPlaceholderText("Select a station...");
    await act(async () => {
      fireEvent.change(autocomplete, { target: { value: "S" } });
    });

    // Verify suggestions appear
    const suggestions = screen.getAllByRole("option");
    expect(suggestions).toHaveLength(2);
    expect(suggestions[0]).toHaveTextContent("Berlin Station");
    expect(suggestions[1]).toHaveTextContent("Hamburg Station");
  });

  test("handles station selection", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <DashboardView />
        </MemoryRouter>
      );
    });

    // Get the autocomplete input
    const autocomplete = screen.getByPlaceholderText("Select a station...");

    // Type in the autocomplete to trigger suggestions
    await act(async () => {
      fireEvent.change(autocomplete, { target: { value: "Berlin" } });
    });

    // Click the suggestion
    const option = screen.getByText("Berlin Station");
    fireEvent.click(option);

    // Verify the station was selected
    expect(
      screen.getByText("Selected station: Berlin Station")
    ).toBeInTheDocument();

    // Verify the station's booking is displayed
    expect(screen.getByText("KERA")).toBeInTheDocument();
  });

  // test("handles month navigation", () => {
  //   render(
  //     <MemoryRouter>
  //       <DashboardView />
  //     </MemoryRouter>
  //   );

  //   // Get current month display
  //   const initialMonth = screen.getByText(/^[A-Za-z]+ \d{4}$/);
  //   const initialMonthText = initialMonth.textContent;

  //   // Click next month
  //   const nextBtn = screen.getByText(">");
  //   fireEvent.click(nextBtn);

  //   // Verify month changed
  //   expect(screen.getByText(/^[A-Za-z]+ \d{4}$/)).not.toHaveTextContent(
  //     initialMonthText
  //   );

  //   // Click previous month
  //   const prevBtn = screen.getByText("<");
  //   fireEvent.click(prevBtn);

  //   // Verify back to initial month
  //   expect(screen.getByText(/^[A-Za-z]+ \d{4}$/)).toHaveTextContent(
  //     initialMonthText
  //   );
  // });

  test("handles API error gracefully", async () => {
    // Mock API error
    global.fetch.mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    // Verify error is handled
    const consoleErrorSpy = jest.spyOn(console, "error");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch stations:",
      expect.any(Error)
    );
  });
});
