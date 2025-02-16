import { Loan, loans, LoanSummary, NewLoan, UpdateLoan } from '../db/schema';
import PostgesClient from '../db/postgresClient';
import { count, eq, sum, asc } from 'drizzle-orm';
import { BadRequestError } from '../errors/CustomError';

const db = PostgesClient.getInstance();

/**
 * Save a new loan to the database.
 * @param {NewLoan} loanData - The loan data to save
 * @returns {Loan} The saved loan
 */
export const saveLoan = async (loanData: NewLoan): Promise<Loan> => {
  if (Number(loanData.requestedAmount) < 0) {
    throw new BadRequestError('Requested amount must be a positive number.');
  }
  const [newLoan] = await db.insert(loans).values(loanData).returning();
  return newLoan;
};

/**
 * Get a loan by its ID.
 * @param {number} id - The ID of the loan to get
 * @returns {Loan | null} The loan or null if not found
 */
export const getLoanById = async (id: number): Promise<Loan | null> => {
  const [loan] = await db.select().from(loans).where(eq(loans.id, id));
  return loan;
};

/**
 * Get all loans.
 * @returns {Loan[]} All loans
 */
export const getLoans = async (): Promise<Loan[]> => {
  const loansData = await db.select().from(loans).orderBy(asc(loans.createdAt));
  return loansData;
};

/**
 * Update a loan by its ID.
 * @param {number} id - The ID of the loan to update
 * @param {UpdateLoan} updateData - The data to update
 * @returns {Loan | null} The updated loan or null if not found
 */
export const updateLoan = async (
  id: number,
  updateData: UpdateLoan,
): Promise<Loan | null> => {
  if (Number(updateData.requestedAmount) < 0) {
    throw new BadRequestError('Requested amount must be a positive number.');
  }

  const [loan] = await db
    .update(loans)
    .set(updateData)
    .where(eq(loans.id, id))
    .returning();
  return loan;
};

/**
 * Get summarized loan data per status.
 * @returns {any} The summarized loan data
 */
export const getLoansSummary = async (): Promise<LoanSummary[]> => {
  const summary = await db
    .select({
      status: loans.status,
      totalApplications: count(loans.id),
      totalRequestedAmount: sum(loans.requestedAmount),
    })
    .from(loans)
    .groupBy(loans.status);

  return summary as LoanSummary[];
};

/**
 * Delete a loan by its ID.
 * @param {number} id - The ID of the loan to delete
 */
export const deleteLoan = async (id: number): Promise<void> => {
  await db.delete(loans).where(eq(loans.id, id));
};
