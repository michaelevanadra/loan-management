import { useEffect, useState } from 'react';
import { getLoansSummary } from '../api/loanService';
import { LoanStatus, LoanSummary } from '../types';

const LoanDashboard: React.FC = () => {
  const [summary, setSummary] = useState<LoanSummary[]>([]);
  const statusColor = {
    [LoanStatus.APPROVED]: 'text-green-500',
    [LoanStatus.REJECTED]: 'text-red-500',
    [LoanStatus.PENDING]: 'text-yellow-500',
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getLoansSummary();
      setSummary(summary);
    };
    fetchSummary();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summary.map(
        ({ status, totalApplications, totalRequestedAmount }, idx) => (
          <div
            key={`${idx}-${status}`}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
          >
            <div className="mb-2">
              <h3 className={`text-lg font-semibold ${statusColor[status]}`}>
                {status}
              </h3>
              <p className="text-sm text-gray-600">Application Summary</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {totalApplications.toLocaleString()} Application
                {totalApplications === 1 ? '' : 's'}
              </p>
              <p className="text-sm text-gray-500">
                Total Amount: ${totalRequestedAmount.toLocaleString()}
              </p>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default LoanDashboard;
