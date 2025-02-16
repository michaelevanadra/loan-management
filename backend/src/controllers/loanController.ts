import { NextFunction, Request, Response } from 'express';
import { CreateLoanData, UpdateLoanData } from '../reqSchema/loanReqSchema';
import { NotFoundError } from '../errors/CustomError';
import * as loanService from '../services/loanService';

/**
 * Controller for creating and validating a new loan request.
 *
 * @param {CreateLoanData} req.body - Loan details
 */
export const createLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const loanData: CreateLoanData = req.body;

    const newLoan = await loanService.saveLoan(loanData);

    res.status(201).json({
      status: 'success',
      data: newLoan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for getting a loan by its ID.
 *
 * @param {string} req.params - Unique identifier for the loan to be retrieved.
 */
export const getLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const loan = await loanService.getLoanById(Number(id));

    if (!loan) {
      throw new NotFoundError(
        'Unable to find the specified loan ID. Please check the ID and try again.',
      );
    }

    res.status(200).json({
      status: 'success',
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for getting all loans.
 */
export const getLoans = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Limit, filter and paginate
    const loans = await loanService.getLoans();

    res.status(200).json({
      status: 'success',
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for getting summarized loan data per status
 */
export const getLoansSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await loanService.getLoansSummary();

    res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for updating a loan by its ID.
 *
 * @param {string} req.params - Unique identifier of the loan to be updated.
 * @param {UpdateLoanData} req.body - Updated loan details
 */
export const updateLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateLoanData = req.body;

    const updatedLoan = await loanService.updateLoan(Number(id), updateData);

    if (!updatedLoan) {
      throw new NotFoundError(
        'Unable to find the specified loan ID. Please check the ID and try again.',
      );
    }

    res.status(200).json({
      status: 'success',
      data: updatedLoan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for deleting a loan by its ID.
 *
 * @param {string} req.params - Unique identifier of the loan to be deleted.
 */
export const deleteLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    await loanService.deleteLoan(Number(id));

    res.status(200).json({
      status: 'success',
      message: `Successfully deleted loan details.`,
    });
  } catch (error) {
    next(error);
  }
};
