import { LoanStatus } from '../types';
import { useLoansSummary } from '../hooks/loanHooks';
import Spinner from './commons/Spinner';
import Error from './commons/Error';

const LoanDashboard: React.FC = () => {
  const summary = useLoansSummary();
  const statusColor = {
    [LoanStatus.APPROVED]: 'text-green-500',
    [LoanStatus.REJECTED]: 'text-red-500',
    [LoanStatus.PENDING]: 'text-yellow-500',
  };

  if (summary.isLoading) {
    return <Spinner />;
  }

  if (summary.error) {
    return <Error error={summary.error?.message} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summary.data?.map(
        ({ status, totalApplications, totalRequestedAmount }, idx) => (
          <div
            key={`${idx}-${status}`}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2">
              <h3 className={`text-lg font-semibold ${statusColor[status]}`}>
                {status}
              </h3>
              <p className="text-sm text-gray-600">Application Summary</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {totalApplications} Application
                {totalApplications === 1 ? '' : 's'}
              </p>
              <p className="text-sm text-gray-500">
                Total Amount: ${totalRequestedAmount}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LoanDashboard;
