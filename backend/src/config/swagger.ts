export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Loan Management API',
    version: '1.0.0',
    description: 'API documentation for Loan Management Service',
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/loans': {
      post: {
        tags: ['Loans'],
        summary: 'Create a loan',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateLoanRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Loan created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoanSuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoanPositiveAmount400Response',
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan500Response',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Loans'],
        summary: 'Get all loans',
        responses: {
          '200': {
            description: 'List of loans',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    $ref: '#/components/schemas/Loan',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan500Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/loans/summary': {
      get: {
        tags: ['Loans'],
        summary: 'Get summarized loan data per status',
        responses: {
          '200': {
            description: 'Summary of loans per status',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SummarySuccessResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan500Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/loans/{id}': {
      get: {
        tags: ['Loans'],
        summary: 'Get a loan by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Loan ID',
          },
        ],
        responses: {
          '200': {
            description: 'Loan found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan400Response',
                },
              },
            },
          },
          '404': {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan404Response',
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan500Response',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Loans'],
        summary: 'Update a loan',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Loan ID',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateLoan',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Loan updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoanSuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan400Response',
                },
              },
            },
          },
          '404': {
            description: 'Loan not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan404Response',
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan500Response',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Loans'],
        summary: 'Delete a loan',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Loan ID',
          },
        ],
        responses: {
          '200': {
            description: 'Loan deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Successfully deleted loan details.',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan400Response',
                },
              },
            },
          },
          '404': {
            description: 'Loan not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan404Response',
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Loan500Response',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Loan: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
            description: 'The unique identifier of the loan',
          },
          applicantName: {
            type: 'string',
            example: 'John Doe',
            description: 'The name of the applicant',
          },
          requestedAmount: {
            type: 'string',
            example: '10000.00',
            description: 'The requested amount of the loan',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            example: 'PENDING',
            description: 'The status of the loan',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-02-13T19:01:14.468Z',
            description: 'The date and time the loan was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-02-13T19:01:14.468Z',
            description: 'The date and time the loan was updated',
          },
        },
        required: [
          'id',
          'applicantName',
          'requestedAmount',
          'status',
          'createdAt',
          'updatedAt',
        ],
      },
      LoanSummary: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'PENDING',
          },
          totalApplications: {
            type: 'integer',
            example: 10,
          },
          totalRequestedAmount: {
            type: 'string',
            example: '10000.00',
          },
        },
      },
      CreateLoanRequest: {
        type: 'object',
        properties: {
          applicantName: {
            type: 'string',
            example: 'John Doe',
          },
          requestedAmount: {
            type: 'string',
            example: '10000.00',
          },
        },
        required: ['applicantName', 'requestedAmount'],
      },
      UpdateLoan: {
        type: 'object',
        properties: {
          applicantName: {
            type: 'string',
            example: 'John Doe',
          },
          requestedAmount: {
            type: 'string',
            example: '10000.00',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
          },
        },
        required: ['applicantName', 'requestedAmount'],
      },
      LoanSuccessResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'object',
            $ref: '#/components/schemas/Loan',
          },
        },
      },
      SummarySuccessResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              $ref: '#/components/schemas/LoanSummary',
            },
          },
        },
      },
      LoanPositiveAmount400Response: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Requested amount must be a positive number.',
          },
        },
      },
      Loan400Response: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Request validation error',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'custom',
                },
                message: {
                  type: 'string',
                  example: 'Loan ID must be a valid number',
                },
                path: {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'id',
                  },
                },
              },
            },
          },
        },
      },
      Loan404Response: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example:
              'Unable to find the specified loan ID. Please check the ID and try again.',
          },
        },
      },
      Loan500Response: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Failed to process request.',
          },
        },
      },
    },
    securitySchemes: {},
  },
};
