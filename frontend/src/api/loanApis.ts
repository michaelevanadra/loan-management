import { Loan, LoanFormData, LoanSummary } from '../types';
import apiClient from './apiClient';

const LOANS = '/loans';

export const createLoan = async (loan: LoanFormData): Promise<Loan> => {
  const response = await apiClient.post(LOANS, loan);
  return response.data;
};

export const getLoans = async (): Promise<Loan[]> => {
  const response = await apiClient.get(LOANS);
  return response.data;
};

export const updateLoan = async (
  id: string,
  loan: LoanFormData
): Promise<Loan> => {
  const response = await apiClient.put(`${LOANS}/${id}`, loan);
  return response.data;
};

export const deleteLoan = async (id: string): Promise<void> => {
  await apiClient.delete(`${LOANS}/${id}`);
};

export const getLoansSummary = async (): Promise<LoanSummary[]> => {
  const response = await apiClient.get(`${LOANS}/summary`);
  return response.data;
};
