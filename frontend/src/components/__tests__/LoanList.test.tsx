import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanList from '../LoanList';
import { Loan, LoanStatus } from '../../types';
import {
  createLoan,
  deleteLoan,
  getLoans,
  updateLoan,
} from '../../api/loanApis';
import { renderWithClient } from '../commons/TestUtils';

jest.mock('../../api/loanApis');

const mockLoans: Loan[] = [
  {
    id: '1',
    applicantName: 'John Doe',
    requestedAmount: '10000',
    status: LoanStatus.APPROVED,
    createdAt: '2024-03-15T10:00:00.000Z',
    updatedAt: '2024-03-15T10:00:00.000Z',
  },
  {
    id: '2',
    applicantName: 'Jane Smith',
    requestedAmount: '20000',
    status: LoanStatus.PENDING,
    createdAt: '2024-03-14T10:00:00.000Z',
    updatedAt: '2024-03-14T10:00:00.000Z',
  },
];

describe('LoanList Component', () => {
  beforeEach(() => {
    (getLoans as jest.Mock).mockResolvedValue(mockLoans);
    (createLoan as jest.Mock).mockResolvedValue(mockLoans[0]);
    (updateLoan as jest.Mock).mockResolvedValue(mockLoans[1]);
    (deleteLoan as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loan list with fetched data', async () => {
    renderWithClient(<LoanList />);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    // Check header
    await waitFor(() => {
      expect(screen.getByText('Loan Applications')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /New Application/i })
      ).toBeInTheDocument();
    });

    // Wait for loans to be loaded
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Check loan card details
    expect(screen.getByText('$10000')).toBeInTheDocument();
    expect(screen.getByText('$20000')).toBeInTheDocument();
    expect(screen.getByText(LoanStatus.APPROVED)).toBeInTheDocument();
    expect(screen.getByText(LoanStatus.PENDING)).toBeInTheDocument();
  });

  it('opens form modal when New Application button is clicked', async () => {
    const user = userEvent.setup();
    renderWithClient(<LoanList />);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(
        screen.getByRole('button', { name: /New Application/i })
      );
    });

    expect(screen.getByText('New Loan Application')).toBeInTheDocument();
    expect(screen.getByLabelText(/Applicant Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loan Amount/i)).toBeInTheDocument();
  });

  it('creates new loan application', async () => {
    const user = userEvent.setup();
    const newLoan: Loan = {
      id: '3',
      applicantName: 'New User',
      requestedAmount: '30000',
      status: LoanStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (createLoan as jest.Mock).mockResolvedValue(newLoan);

    renderWithClient(<LoanList />);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    // Open form
    await waitFor(async () => {
      await user.click(
        screen.getByRole('button', { name: /New Application/i })
      );
    });

    // Fill form
    await user.type(screen.getByLabelText(/Applicant Name/i), 'New User');
    await user.type(screen.getByLabelText(/Loan Amount/i), '30000');

    // Submit form
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Verify API call
    expect(createLoan).toHaveBeenCalledWith(
      expect.objectContaining({
        applicantName: 'New User',
        requestedAmount: '30000',
      })
    );

    // Verify new loan appears in list
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
      expect(screen.getByText('$30000')).toBeInTheDocument();
    });
  });

  it('edits existing loan application', async () => {
    const user = userEvent.setup();
    const updatedLoan = { ...mockLoans[0], applicantName: 'Updated Name' };
    (updateLoan as jest.Mock).mockResolvedValue(updatedLoan);

    renderWithClient(<LoanList />);

    // Wait for loans to load and click edit
    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /Edit/i });
      user.click(editButtons[0]);
    });

    // Verify edit form is populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    });

    // Update name
    const nameInput = screen.getByLabelText(/Applicant Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    // Submit form
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Verify API call
    expect(updateLoan).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        applicantName: 'Updated Name',
      })
    );

    // Verify updated loan appears in list
    await waitFor(() => {
      expect(screen.getByText('Updated Name')).toBeInTheDocument();
    });
  });

  it('deletes loan application after confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    (deleteLoan as jest.Mock).mockResolvedValue(undefined);

    renderWithClient(<LoanList />);

    // Wait for loans to load and click delete
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
      user.click(deleteButtons[0]);
    });

    // Verify loan is removed from list
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('cancels loan deletion when user declines confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);

    renderWithClient(<LoanList />);

    // Wait for loans to load and click delete
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
      user.click(deleteButtons[0]);
    });

    // Verify API was not called
    expect(deleteLoan).not.toHaveBeenCalled();

    // Verify loan remains in list
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
