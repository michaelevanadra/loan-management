import request from 'supertest';
import express from 'express';
import { router } from '../../routes';
import { errorHandler } from '../../middleware/errorHandler';
import * as loanService from '../../services/loanService';
import { LoanStatus } from '@/db/schema';

const app = express();
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

describe('Loans API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/loans', () => {
    it('should return 201 and create a new loan', async () => {
      const mockLoanData = {
        applicantName: 'John Doe',
        requestedAmount: '1000.00',
      };

      jest.spyOn(loanService, 'saveLoan').mockImplementation(() =>
        Promise.resolve({
          ...mockLoanData,
          id: 112,
          status: LoanStatus.PENDING,
          createdAt: new Date('2025-02-16T16:41:31.572Z'),
          updatedAt: new Date('2025-02-16T16:41:31.572Z'),
        }),
      );

      const response = await request(app)
        .post('/api/loans')
        .send(mockLoanData)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: 112,
          applicantName: mockLoanData.applicantName,
          requestedAmount: mockLoanData.requestedAmount,
          status: 'PENDING',
          createdAt: '2025-02-16T16:41:31.572Z',
          updatedAt: '2025-02-16T16:41:31.572Z',
        }),
      });
    });

    it('should return 400 if request body is empty', async () => {
      const response = await request(app)
        .post('/api/loans')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Request validation error',
        errors: expect.any(Array),
      });
    });

    it('should return 400 if applicant name is empty', async () => {
      const response = await request(app)
        .post('/api/loans')
        .send({ applicantName: '', requestedAmount: '1' })
        .expect(400);

      expect(response.body.errors[0].message).toEqual(
        'String must contain at least 3 character(s)',
      );
    });

    it('should return 400 if applicant name is too long', async () => {
      const response = await request(app)
        .post('/api/loans')
        .send({ applicantName: 'John Doe'.repeat(100), requestedAmount: '1' })
        .expect(400);

      expect(response.body.errors[0].message).toEqual(
        'String must contain at most 255 character(s)',
      );
    });

    it('should return 400 if requested amount is not a number', async () => {
      const response = await request(app)
        .post('/api/loans')
        .send({ applicantName: 'John Doe', requestedAmount: 'not a number' })
        .expect(400);

      expect(response.body.errors[0].message).toEqual(
        'Requested amount must be a valid number.',
      );
    });

    it('should return 500 if server error occurs', async () => {
      jest
        .spyOn(loanService, 'saveLoan')
        .mockImplementation(() => Promise.reject(new Error('Server error')));

      const response = await request(app)
        .post('/api/loans')
        .send({ applicantName: 'John Doe', requestedAmount: '1000.00' })
        .expect(500);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Failed to process request',
      });
    });
  });

  describe('GET /api/loans/:id', () => {
    it('should return 200 and details of a loan', async () => {
      const mockLoanData = {
        applicantName: 'Jane Doe',
        requestedAmount: '1100.00',
      };

      jest.spyOn(loanService, 'getLoanById').mockImplementation(() =>
        Promise.resolve({
          ...mockLoanData,
          id: 111,
          status: LoanStatus.PENDING,
          createdAt: new Date('2025-02-16T16:41:31.572Z'),
          updatedAt: new Date('2025-02-16T16:41:31.572Z'),
        }),
      );

      const response = await request(app).get('/api/loans/1').expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: 111,
          applicantName: mockLoanData.applicantName,
          requestedAmount: mockLoanData.requestedAmount,
        }),
      });
    });

    it('should return 404 if loan id is not found', async () => {
      jest
        .spyOn(loanService, 'getLoanById')
        .mockImplementation(() => Promise.resolve(null));

      const response = await request(app).get('/api/loans/1').expect(404);

      expect(response.body).toEqual({
        status: 'error',
        message:
          'Unable to find the specified loan ID. Please check the ID and try again.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      jest
        .spyOn(loanService, 'getLoanById')
        .mockImplementation(() => Promise.reject(new Error('Server error')));

      const response = await request(app).get('/api/loans/1').expect(500);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Failed to process request',
      });
    });
  });

  describe('GET /api/loans', () => {
    it('should return 200 and list of loans', async () => {
      jest.spyOn(loanService, 'getLoans').mockImplementation(() =>
        Promise.resolve([
          {
            id: 113,
            applicantName: 'James Smith',
            requestedAmount: '1110.00',
            status: LoanStatus.PENDING,
            createdAt: new Date('2025-02-16T16:41:31.572Z'),
            updatedAt: new Date('2025-02-16T16:41:31.572Z'),
          },
          {
            id: 114,
            applicantName: 'James Bond',
            requestedAmount: '2110.00',
            status: LoanStatus.APPROVED,
            createdAt: new Date('2025-02-17T01:41:31.531Z'),
            updatedAt: new Date('2025-02-13T13:10:32.573Z'),
          },
        ]),
      );

      const response = await request(app).get('/api/loans').expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: [
          {
            id: 113,
            applicantName: 'James Smith',
            requestedAmount: '1110.00',
            status: 'PENDING',
            createdAt: '2025-02-16T16:41:31.572Z',
            updatedAt: '2025-02-16T16:41:31.572Z',
          },
          {
            id: 114,
            applicantName: 'James Bond',
            requestedAmount: '2110.00',
            status: 'APPROVED',
            createdAt: '2025-02-17T01:41:31.531Z',
            updatedAt: '2025-02-13T13:10:32.573Z',
          },
        ],
      });
    });

    it('should return 500 if server error occurs', async () => {
      jest
        .spyOn(loanService, 'getLoans')
        .mockImplementation(() => Promise.reject(new Error('Server error')));

      const response = await request(app).get('/api/loans').expect(500);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Failed to process request',
      });
    });
  });

  describe('GET /api/loans/summary', () => {
    it('should return 200 and summary of loans', async () => {
      const SUMMARY_LIST = [
        {
          status: LoanStatus.PENDING,
          totalApplications: 1,
          totalRequestedAmount: '1000.00',
        },
        {
          status: LoanStatus.APPROVED,
          totalApplications: 2,
          totalRequestedAmount: '2000.00',
        },
        {
          status: LoanStatus.REJECTED,
          totalApplications: 3,
          totalRequestedAmount: '3000.00',
        },
      ];

      jest
        .spyOn(loanService, 'getLoansSummary')
        .mockImplementation(() => Promise.resolve(SUMMARY_LIST));

      const response = await request(app).get('/api/loans/summary').expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: SUMMARY_LIST,
      });
    });

    it('should return 500 if server error occurs', async () => {
      jest
        .spyOn(loanService, 'getLoansSummary')
        .mockImplementation(() => Promise.reject(new Error('Server error')));

      const response = await request(app).get('/api/loans/summary').expect(500);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Failed to process request',
      });
    });
  });

  describe('PUT /api/loans/:id', () => {
    it('should return 200 and update a loan', async () => {
      const mockLoanData = {
        applicantName: 'Jonny Papa',
        requestedAmount: '900.50',
      };

      jest.spyOn(loanService, 'updateLoan').mockImplementation(() =>
        Promise.resolve({
          ...mockLoanData,
          id: 201,
          status: LoanStatus.APPROVED,
          createdAt: new Date('2025-02-16T16:41:31.572Z'),
          updatedAt: new Date('2025-02-16T16:41:31.572Z'),
        }),
      );

      const response = await request(app)
        .put('/api/loans/201')
        .send(mockLoanData)
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: {
          ...mockLoanData,
          id: 201,
          status: 'APPROVED',
          createdAt: '2025-02-16T16:41:31.572Z',
          updatedAt: '2025-02-16T16:41:31.572Z',
        },
      });
    });

    it('should return 400 if request body is empty', async () => {
      const response = await request(app)
        .put('/api/loans/201')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Request validation error',
        errors: expect.any(Array),
      });
    });

    it('should return 400 if applicant name is empty', async () => {
      const response = await request(app)
        .put('/api/loans/201')
        .send({ applicantName: '', requestedAmount: '1' })
        .expect(400);

      expect(response.body.errors[0].message).toEqual(
        'String must contain at least 3 character(s)',
      );
    });

    it('should return 400 if applicant name is too long', async () => {
      const response = await request(app)
        .put('/api/loans/201')
        .send({ applicantName: 'John Doe'.repeat(100), requestedAmount: '1' })
        .expect(400);

      expect(response.body.errors[0].message).toEqual(
        'String must contain at most 255 character(s)',
      );
    });

    it('should return 400 if requested amount is not a number', async () => {
      const response = await request(app)
        .put('/api/loans/201')
        .send({ applicantName: 'John Doe', requestedAmount: 'not a number' })
        .expect(400);

      expect(response.body.errors[0].message).toEqual(
        'Requested amount must be a valid number.',
      );
    });

    it('should return 404 if loan id is invalid', async () => {
      const response = await request(app).get('/api/loans/one2').expect(400);

      expect(response.body.errors[0].message).toEqual(
        'Loan ID must be a valid number',
      );
    });

    it('should return 500 if server error occurs', async () => {
      jest
        .spyOn(loanService, 'updateLoan')
        .mockImplementation(() => Promise.reject(new Error('Server error')));

      const response = await request(app)
        .put('/api/loans/201')
        .send({ applicantName: 'John Doe', requestedAmount: '1000.00' })
        .expect(500);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Failed to process request',
      });
    });
  });

  describe('DELETE /api/loans/:id', () => {
    it('should return 200 and delete a loan', async () => {
      jest
        .spyOn(loanService, 'deleteLoan')
        .mockImplementation(() => Promise.resolve());

      const response = await request(app).delete('/api/loans/404').expect(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Successfully deleted loan details.',
      });
    });
  });
});
