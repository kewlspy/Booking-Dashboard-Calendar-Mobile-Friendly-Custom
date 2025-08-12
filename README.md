# Booking Dashboard Calendar (Mobile-Friendly)

A modern, responsive booking management dashboard built with React, featuring a custom calendar interface with drag-and-drop capabilities for managing bookings.

## 🌟 Features

### 📅 Calendar Interface

- Interactive month-based calendar view
- Mobile-friendly responsive design
- Visual date grid with clear date indicators
- Week day headers for easy navigation

### 🎯 Booking Management

- Drag-and-drop booking date adjustments
  - Green handle for start date
  - Red handle for end date
- Visual feedback during drag operations
- Automatic date validation to prevent invalid booking dates
- Preserves booking time while changing dates

### 🔍 Station Management

- Station selection via autocomplete
- Filtered view of bookings by station
- Real-time booking updates

### 💫 User Interface

- Clean, modern design
- Responsive layout that works on all devices
- Visual feedback for user interactions
- Smooth animations and transitions
- Clear color coding for start and end dates

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository

```bash
git clone https://github.com/kewlspy/Booking-Dashboard-Calendar-Mobile-Friendly-Custom.git
cd myApp
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

## 🛠️ Usage Guide

### Managing Bookings

1. **Viewing Bookings**

   - Select a station using the autocomplete dropdown
   - Bookings for the selected station will appear on the calendar
   - Green background indicates start date
   - Red background indicates end date

2. **Modifying Booking Dates**

   - To change start date:
     1. Grab the green shuttle icon
     2. Drag to the desired date
     3. Release to update
   - To change end date:
     1. Grab the red shuttle icon
     2. Drag to the desired date
     3. Release to update

3. **Navigation**
   - Use the arrow buttons to move between months
   - Click "Today" to return to the current month

### Booking Details

- Click on any booking to view detailed information:
  - Customer name
  - Booking ID
  - Start and end dates
  - Station information

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🏗️ Built With

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [@dnd-kit/core](https://dndkit.com/) - Drag and drop functionality
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Jest](https://jestjs.io/) - Testing framework

## 📝 Project Structure

```
src/
├── components/
│   ├── Autocomplete.jsx        # Station selection component
│   ├── DraggableBooking.jsx   # Draggable booking component
│   └── DroppableDay.jsx       # Calendar day component
├── pages/
│   └── DashboardView.jsx      # Main dashboard page
├── utils/
│   └── dateHelpers.js         # Date utility functions
└── App.jsx                    # Root component
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
