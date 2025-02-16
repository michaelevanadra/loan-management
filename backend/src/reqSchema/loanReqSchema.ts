import { z } from 'zod';
import { LoanStatus } from '../db/schema';

export const createLoanReqSchema = z.object({
  requestedAmount: z
    .string()
    .nonempty()
    .refine((val) => val && !isNaN(Number(val)), {
      message: 'Requested amount must be a valid number.',
    }),
  applicantName: z.string().min(3).max(255),
});

export type CreateLoanData = z.infer<typeof createLoanReqSchema>;

export const updateLoanReqSchema = createLoanReqSchema.extend({
  status: z.nativeEnum(LoanStatus).optional(),
});

export type UpdateLoanData = z.infer<typeof updateLoanReqSchema>;

export const idParamSchema = z.object({
  id: z
    .string()
    .refine((val: unknown) => val && !isNaN(val as unknown as number), {
      message: 'Loan ID must be a valid number',
    }),
});

export type IdParam = z.infer<typeof idParamSchema>;
