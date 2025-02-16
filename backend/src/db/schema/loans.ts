import {
  pgTable,
  numeric,
  timestamp,
  pgEnum,
  varchar,
  serial,
} from 'drizzle-orm/pg-core';

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const loanStatus = pgEnum('loan_status', [
  LoanStatus.PENDING,
  LoanStatus.APPROVED,
  LoanStatus.REJECTED,
]);

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  applicantName: varchar('application_name', { length: 255 }).notNull(),
  requestedAmount: numeric('requested_amount'),
  status: loanStatus('status').default(LoanStatus.PENDING).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export type NewLoan = typeof loans.$inferInsert;
export type UpdateLoan = Omit<typeof loans.$inferInsert, 'id'>;
export type Loan = typeof loans.$inferSelect;

export type LoanSummary = {
  status: LoanStatus;
  totalApplications: number;
  totalRequestedAmount: string;
};
