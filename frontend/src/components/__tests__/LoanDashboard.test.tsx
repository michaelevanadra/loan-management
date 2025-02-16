import { render, screen } from '@testing-library/react';
import LoanDashboard from '../LoanDashboard';
import { LoanSummary, LoanStatus } from '../../types';
import { getLoansSummary } from '../../api/loanService';

const MOCK_SUMMARY: LoanSummary[] = [
  {
    status: LoanStatus.APPROVED,
    totalApplications: 4,
    totalRequestedAmount: '45000.00',
  },
  {
    status: LoanStatus.PENDING,
    totalApplications: 2,
    totalRequestedAmount: '200.00',
  },
  {
    status: LoanStatus.REJECTED,
    totalApplications: 1,
    totalRequestedAmount: '201.00',
  },
];

jest.mock('../../api/loanService');

describe('LoanDashboard Component', () => {
  beforeAll(() => {
    (getLoansSummary as jest.Mock).mockResolvedValue(MOCK_SUMMARY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays summary', async () => {
    render(<LoanDashboard />);

    // Total Applications
    expect(await screen.findByText('4 Applications')).toBeInTheDocument();
    expect(await screen.findByText('2 Applications')).toBeInTheDocument();
    expect(await screen.findByText('1 Application')).toBeInTheDocument();

    expect(await screen.findByText('APPROVED')).toBeInTheDocument();
    expect(await screen.findByText('PENDING')).toBeInTheDocument();
    expect(await screen.findByText('REJECTED')).toBeInTheDocument();

    expect(
      await screen.findByText('Total Amount: $45000.00'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Total Amount: $200.00'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Total Amount: $201.00'),
    ).toBeInTheDocument();
  });
});
