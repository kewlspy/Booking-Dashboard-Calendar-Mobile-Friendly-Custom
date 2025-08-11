import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Autocomplete from "./Autocomplete";

describe("Autocomplete", () => {
  // Mock scrollIntoView since it's not available in JSDOM
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  const mockSuggestions = [
    { id: "1", name: "Berlin Station" },
    { id: "2", name: "Hamburg Station" },
  ];

  const mockFetchSuggestions = jest.fn();
  const mockOnSelect = jest.fn();
  const mockGetSuggestionLabel = (item) => item.name;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the fetch suggestions to return our test data
    mockFetchSuggestions.mockResolvedValue(mockSuggestions);
  });

  const renderAutocomplete = () => {
    return render(
      <Autocomplete
        fetchSuggestions={mockFetchSuggestions}
        onSelect={mockOnSelect}
        getSuggestionLabel={mockGetSuggestionLabel}
        placeholder="Select a station..."
      />
    );
  };

  test("renders input field with placeholder", () => {
    renderAutocomplete();
    expect(
      screen.getByPlaceholderText("Select a station...")
    ).toBeInTheDocument();
  });

  test("shows no suggestions when input is empty", () => {
    renderAutocomplete();
    const input = screen.getByPlaceholderText("Select a station...");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    // Clear input just to be sure
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("fetches and displays suggestions when typing", async () => {
    renderAutocomplete();
    const input = screen.getByPlaceholderText("Select a station...");

    // Type into the input
    await act(async () => {
      fireEvent.change(input, { target: { value: "Ber" } });
    });

    // Wait for debounce and check if fetchSuggestions was called
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    expect(mockFetchSuggestions).toHaveBeenCalledWith("Ber");

    // Check if suggestions are displayed
    const suggestionList = screen.getByRole("listbox");
    expect(suggestionList).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("Berlin Station");
    expect(options[1]).toHaveTextContent("Hamburg Station");
  });

  test("selects suggestion on click", async () => {
    renderAutocomplete();
    const input = screen.getByPlaceholderText("Select a station...");

    // Type to show suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: "Ber" } });
    });

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    // Click the first suggestion
    const firstOption = screen.getAllByRole("option")[0];
    fireEvent.click(firstOption);

    // Check if correct item was selected
    expect(mockOnSelect).toHaveBeenCalledWith(mockSuggestions[0]);
    expect(input.value).toBe("Berlin Station");
  });

  test("handles keyboard navigation", async () => {
    renderAutocomplete();
    const input = screen.getByPlaceholderText("Select a station...");

    // Type to show suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: "S" } });
    });

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    // Press arrow down to highlight first option
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");

    // Press arrow down again to highlight second option
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    // Press Enter to select the highlighted option
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockOnSelect).toHaveBeenCalledWith(mockSuggestions[1]);
    expect(input.value).toBe("Hamburg Station");
  });

  test("closes suggestions on outside click", async () => {
    renderAutocomplete();
    const input = screen.getByPlaceholderText("Select a station...");

    // Type to show suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: "S" } });
    });

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    // Verify suggestions are shown
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Verify suggestions are hidden
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test('shows "No results" when no suggestions match', async () => {
    mockFetchSuggestions.mockResolvedValueOnce([]);
    renderAutocomplete();
    const input = screen.getByPlaceholderText("Select a station...");

    // Type something that won't match
    await act(async () => {
      fireEvent.change(input, { target: { value: "xyz" } });
    });

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    // Check for "No results" message
    expect(screen.getByRole("option")).toHaveTextContent("No results");
  });
});
