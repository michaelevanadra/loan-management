import '@testing-library/jest-dom';
import React from 'react';

jest.clearAllMocks();
jest.mock('./src/helpers/config', () => ({
  BACKEND_API_URL: 'http://localhost:3001',
}));

jest.mock('lucide-react', () => ({
  Plus: () => React.createElement('span', { 'data-testid': 'plus-icon' }),
  Pencil: () => React.createElement('span', { 'data-testid': 'pencil-icon' }),
  Trash: () => React.createElement('span', { 'data-testid': 'trash-icon' }),
}));
