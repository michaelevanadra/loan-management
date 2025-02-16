import { Router, Request, Response } from 'express';
import {
  validateRequest,
  ValidateRequestType,
} from '../middleware/validateRequest';
import {
  createLoanReqSchema,
  updateLoanReqSchema,
  idParamSchema,
} from '../reqSchema/loanReqSchema';
import {
  createLoan,
  getLoan,
  getLoans,
  updateLoan,
  deleteLoan,
  getLoansSummary,
} from '../controllers/loanController';

export const router = Router();

router.post('/', (_req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: 'success', message: 'Welcome to Loan Application API' });
});
router.get('/loans/summary', getLoansSummary);
router.post('/loans', validateRequest(createLoanReqSchema), createLoan);
router.get('/loans', getLoans);
router.get(
  '/loans/:id',
  validateRequest(idParamSchema, ValidateRequestType.PARAMS),
  getLoan,
);
router.put(
  '/loans/:id',
  validateRequest(idParamSchema, ValidateRequestType.PARAMS),
  validateRequest(updateLoanReqSchema),
  updateLoan,
);
router.delete(
  '/loans/:id',
  validateRequest(idParamSchema, ValidateRequestType.PARAMS),
  deleteLoan,
);
