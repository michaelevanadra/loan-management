import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
import LoanForm from './LoanForm';
import { Loan, LoanFormData, LoanStatus } from '../types';
import {
  createLoan,
  deleteLoan,
  getLoans,
  updateLoan,
} from '../api/loanService';

const LoanList: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const statusColor = {
    [LoanStatus.APPROVED]: 'bg-green-500',
    [LoanStatus.REJECTED]: 'bg-red-500',
    [LoanStatus.PENDING]: 'bg-yellow-500',
  };

  useEffect(() => {
    const fetchLoans = async (): Promise<void> => {
      const fetchedLoans = await getLoans();
      setLoans(fetchedLoans);
    };
    fetchLoans();
  }, []);

  const handleSave = useCallback(
    (loan: LoanFormData): void => {
      const saveLoanDetails = async () => {
        if (selectedLoan) {
          const updatedLoan = await updateLoan(selectedLoan.id, {
            applicantName: loan.applicantName ?? '',
            requestedAmount: loan.requestedAmount ?? '',
            status: loan.status,
          });
          setLoans(
            loans.map((loan) =>
              loan.id === updatedLoan.id ? updatedLoan : loan,
            ),
          );
        } else {
          const newLoan = await createLoan({
            applicantName: loan.applicantName ?? '',
            requestedAmount: loan.requestedAmount ?? '',
          });
          setLoans([...loans, newLoan]);
        }
        setIsModalOpen(false);
        setSelectedLoan(null);
      };

      saveLoanDetails();
    },
    [loans, selectedLoan],
  );

  const handleDelete = (id: string): void => {
    const deleteLoanDetails = async () => {
      if (confirm('Are you sure you want to delete this loan?')) {
        await deleteLoan(id);
        setLoans(loans.filter((loan) => loan.id !== id));
      }
    };
    deleteLoanDetails();
  };

  const handleEdit = (loan: Loan): void => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Loan Applications</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" /> New Application
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">{loan.applicantName}</h3>
                <span
                  className={`${
                    statusColor[loan.status]
                  } text-white text-xs px-2 py-1 rounded-full`}
                >
                  {loan.status}
                </span>
              </div>
              <p className="text-2xl font-bold mb-2 truncate">
                ${loan.requestedAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Applied on: {new Date(loan.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(loan)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loan.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
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
