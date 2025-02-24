import { useCallback, useState } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
import LoanForm from './LoanForm';
import { Loan, LoanFormData, LoanStatus } from '../types';
import {
  useCreateLoan,
  useDeleteLoan,
  useLoans,
  useUpdateLoan,
} from '../hooks/loanHooks';
import Spinner from './commons/Spinner';
import Error from './commons/Error';

const LoanList: React.FC = () => {
  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();
  const loans = useLoans();
  const deleteLoan = useDeleteLoan();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const statusColor = {
    [LoanStatus.APPROVED]: 'bg-green-500',
    [LoanStatus.REJECTED]: 'bg-red-500',
    [LoanStatus.PENDING]: 'bg-yellow-500',
  };

  const handleSave = useCallback(
    (loan: LoanFormData): void => {
      if (selectedLoan) {
        updateLoan.mutate({
          id: selectedLoan.id,
          loan: {
            applicantName: loan.applicantName ?? '',
            requestedAmount: loan.requestedAmount ?? '',
            status: loan.status,
          },
        });
      } else {
        createLoan.mutate({
          applicantName: loan.applicantName ?? '',
          requestedAmount: loan.requestedAmount ?? '',
        });
      }
      setIsModalOpen(false);
      setSelectedLoan(null);
    },
    [selectedLoan, createLoan, updateLoan]
  );

  const handleDelete = (id: string): void => {
    const deleteLoanDetails = async () => {
      if (confirm('Are you sure you want to delete this loan?')) {
        deleteLoan.mutate(id);
      }
    };
    deleteLoanDetails();
  };

  const handleEdit = (loan: Loan): void => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  if (loans.isLoading) {
    return <Spinner />;
  }

  if (loans.error) {
    return <Error error={loans.error?.message} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Loan Applications</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-white transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" /> New Application
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loans.data?.map((loan) => (
          <div
            key={loan.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="truncate font-semibold">{loan.applicantName}</h3>
                <span
                  className={`${
                    statusColor[loan.status]
                  } rounded-full px-2 py-1 text-xs text-white`}
                >
                  {loan.status}
                </span>
              </div>
              <p className="mb-2 truncate text-2xl font-bold">
                ${loan.requestedAmount}
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Applied on: {new Date(loan.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(loan)}
                  className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loan.id)}
                  className="inline-flex items-center rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash className="mr-1 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <LoanForm
          initialData={selectedLoan}
          onSubmit={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLoan(null);
          }}
        />
      )}
    </div>
  );
};

export default LoanList;
