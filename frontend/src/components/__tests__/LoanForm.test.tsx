import { act, fireEvent, render, screen } from '@testing-library/react';
import LoanForm from '../LoanForm';
import { Loan, LoanStatus } from '../../types';

const LOAN_DATA: Loan = {
  id: '1',
  applicantName: 'John Doe',
  requestedAmount: '10000.00',
  status: LoanStatus.PENDING,
  createdAt: '2025-02-15T02:26:38.776Z',
  updatedAt: '2025-02-15T02:26:38.776Z',
};

describe('LoanForm Component', () => {
  it('renders fields for Loan Creation', () => {
    render(<LoanForm onSubmit={() => {}} onCancel={() => {}} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'New Loan Application',
    );
    expect(screen.getByLabelText(/Applicant Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loan Amount/i)).toBeInTheDocument();
    expect(() => screen.getByLabelText(/Status/i)).toThrow();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('renders fields for Loan Update', () => {
    render(
      <LoanForm
        initialData={LOAN_DATA}
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Edit Loan Application',
    );
    expect(screen.getByLabelText(/Applicant Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('validates Applicant Name when value is empty', async () => {
    render(<LoanForm onSubmit={() => {}} onCancel={() => {}} />);

    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);

    const errorMessage = await screen.findByText('Applicant Name is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('validates Loan Amount when value is empty', async () => {
    render(<LoanForm onSubmit={() => {}} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Loan Amount/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    const errorMessage = await screen.findByText('Loan Amount is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('validates Loan Amount when value is not a number', async () => {
    render(<LoanForm onSubmit={() => {}} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Loan Amount/i), {
      target: { value: '1a' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    const errorMessage = await screen.findByText(
      'Loan Amount must be a number',
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('validates Loan Amount when value is less than 0', async () => {
    render(<LoanForm onSubmit={() => {}} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Loan Amount/i), {
      target: { value: '-1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    const errorMessage = await screen.findByText(
      'Loan Amount must be greater than 0',
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('validates Loan Amount when value is more than 1,000,000,000,000', async () => {
    render(<LoanForm onSubmit={() => {}} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Loan Amount/i), {
      target: { value: '1000000000001' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    const errorMessage = await screen.findByText(
      'Loan Amount must be less than 1,000,000,000,000',
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('triggers onSubmit if Submit button is clicked with a valid form data', async () => {
    const mockOnSubmit = jest.fn();
    render(<LoanForm onSubmit={mockOnSubmit} onCancel={() => {}} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Applicant Name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/Loan Amount/i), {
        target: { value: '1000' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('triggers onCancel if Cancel button is clicked', () => {
    const mockOnCancel = jest.fn();
    render(<LoanForm onSubmit={() => {}} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
