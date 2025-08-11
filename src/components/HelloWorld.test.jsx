// src/components/HelloWorld.test.jsx
import React from 'react';  // Import React explicitly
import { render, screen } from '@testing-library/react';
import HelloWorld from './HelloWorld';  // Import the component to test

test('renders Hello, name!', () => {
  render(<HelloWorld name="John" />);
  expect(screen.getByText('Hello, John!')).toBeInTheDocument();  // Check if text is rendered
});
