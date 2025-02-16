import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Loan, LoanFormData, LoanStatus } from '../types';
import { useForm } from 'react-hook-form';

interface LoanFormProps {
  initialData?: Loan | null;
  onSubmit: (data: LoanFormData) => void;
  onCancel: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>();
  const [formData, setFormData] = useState<LoanFormData>({
    applicantName: initialData?.applicantName ?? '',
    requestedAmount: initialData?.requestedAmount ?? '',
    status: initialData?.status ?? LoanStatus.PENDING,
  });

  const handleFormSubmit = (formData: LoanFormData) => {
    onSubmit({
      applicantName: formData.applicantName ?? '',
      requestedAmount: formData.requestedAmount ?? '',
      status: formData.status || LoanStatus.PENDING,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 border border-black shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData?.id ? 'Edit Loan Application' : 'New Loan Application'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="applicantName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Applicant Name
            </label>
            <input
              id="applicantName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              {...register('applicantName', {
                required: 'Applicant Name is required',
                onChange: handleInputChange,
                value: formData.applicantName,
                minLength: {
                  value: 3,
                  message: 'Applicant Name must be at least 3 characters',
                },
                maxLength: {
                  value: 255,
                  message: 'Applicant Name must be less than 255 characters',
                },
              })}
            />
            {errors.applicantName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.applicantName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="requestedAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loan Amount
            </label>
            <input
              id="requestedAmount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              {...register('requestedAmount', {
                required: 'Loan Amount is required',
                onChange: handleInputChange,
                value: formData.requestedAmount,
                validate: (value) => {
                  if (isNaN(Number(value))) {
                    return 'Loan Amount must be a number';
                  }
                },
                min: {
                  value: 1,
                  message: 'Loan Amount must be greater than 0',
                },
                max: {
                  value: 1000000000000,
                  message: 'Loan Amount must be less than 1,000,000,000,000',
                },
              })}
            />
            {errors.requestedAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.requestedAmount.message}
              </p>
            )}
          </div>

          {initialData?.id && (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                {...register('status', {
                  required: 'Status is required',
                  onChange: handleInputChange,
                  value: formData.status,
                })}
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;
