import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLoan,
  deleteLoan,
  getLoans,
  getLoansSummary,
  updateLoan,
} from '../api/loanApis';
import { Loan, LoanFormData } from '../types';

export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: getLoans,
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, loan }: { id: string; loan: LoanFormData }) =>
      updateLoan(id, loan),
    onSuccess: (data) => {
      queryClient.setQueryData(['loans'], (loans: Loan[] | undefined) => {
        if (!loans) return [data];
        return loans.map((loan) => (loan.id === data.id ? data : loan));
      });
    },
  });
};

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: (data) => {
      queryClient.setQueryData(['loans'], (loans: Loan[] | undefined) => {
        if (!loans) return [data];
        return [...loans, data];
      });
    },
  });
};

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLoan,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['loans'], (loans: Loan[] | undefined) => {
        if (!loans) return [];
        return loans.filter((loan) => loan.id !== id);
      });
    },
  });
};

export const useLoansSummary = () => {
  return useQuery({
    queryKey: ['loansSummary'],
    queryFn: getLoansSummary,
  });
};
