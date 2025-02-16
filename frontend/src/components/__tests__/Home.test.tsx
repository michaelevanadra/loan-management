import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../Home';

jest.mock('../LoanList', () => {
  return function MockLoanList() {
    return <div data-testid="loan-list">Loan List Component</div>;
  };
});

jest.mock('../LoanDashboard', () => {
  return function MockLoanDashboard() {
    return <div data-testid="loan-dashboard">Loan Dashboard Component</div>;
  };
});

describe('Home Component', () => {
  it('renders header and tabs', () => {
    render(<Home />);

    expect(screen.getByText('Loan Management System')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('shows LoanList by default', () => {
    render(<Home />);

    expect(screen.getByTestId('loan-list')).toBeInTheDocument();
    expect(screen.queryByTestId('loan-dashboard')).not.toBeInTheDocument();
  });

  it('switches between tabs when clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Initially shows LoanList
    expect(screen.getByTestId('loan-list')).toBeInTheDocument();

    // Click Summary tab
    await user.click(screen.getByText('Summary'));
    expect(screen.getByTestId('loan-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('loan-list')).not.toBeInTheDocument();

    // Click Applications tab
    await user.click(screen.getByText('Applications'));
    expect(screen.getByTestId('loan-list')).toBeInTheDocument();
    expect(screen.queryByTestId('loan-dashboard')).not.toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<Home />);

    const applicationsTab = screen.getByText('Applications');
    const summaryTab = screen.getByText('Summary');

    expect(applicationsTab).toHaveClass('border-primary text-primary');
    expect(summaryTab).not.toHaveClass('border-primary text-primary');
  });
});
