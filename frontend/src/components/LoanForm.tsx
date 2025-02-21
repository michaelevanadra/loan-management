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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-black bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {initialData?.id ? 'Edit Loan Application' : 'New Loan Application'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="applicantName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Applicant Name
            </label>
            <input
              id="applicantName"
              className="focus:ring-primary/50 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
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
              <p className="mt-1 text-sm text-red-500">
                {errors.applicantName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="requestedAmount"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Loan Amount
            </label>
            <input
              id="requestedAmount"
              className="focus:ring-primary/50 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
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
              <p className="mt-1 text-sm text-red-500">
                {errors.requestedAmount.message}
              </p>
            )}
          </div>

          {initialData?.id && (
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                className="focus:ring-primary/50 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
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
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium text-white"
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
