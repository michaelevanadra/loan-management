export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface LoanFormData {
  applicantName: string;
  requestedAmount: string;
  status?: LoanStatus;
}

export interface Loan extends LoanFormData {
  id: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoanSummary {
  status: LoanStatus;
  totalApplications: number;
  totalRequestedAmount: string;
}
