import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import App from './App';

// Avoid loading axios ESM in Jest when App pulls in service modules
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: { headers: { common: {} } },
}));

jest.mock('./services/productService', () => {
  const emptyPaginated = {
    items: [],
    pagination: { page: 1, limit: 10, total_items: 0, total_pages: 0, has_next: false, has_prev: false },
  };
  return {
    productService: {
      getProducts: jest.fn().mockResolvedValue(emptyPaginated),
      getProductsByCategory: jest.fn().mockResolvedValue(emptyPaginated),
    },
  };
});

jest.mock('./services/categoryService', () => ({
  __esModule: true,
  default: {
    getCategories: jest.fn().mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 10, total_items: 0, total_pages: 0, has_next: false, has_prev: false },
    }),
  },
}));

jest.mock('./services/authService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    logout: jest.fn(),
    getToken: jest.fn(() => null),
    isAuthenticated: jest.fn(() => false),
    getCurrentUser: jest.fn(),
  },
}));

const renderApp = () =>
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );

test('renders bakery branding in navigation', () => {
  renderApp();
  expect(screen.getAllByText(/Laxmi Bakery/i).length).toBeGreaterThan(0);
});
