import { useState } from 'react';
import LoanList from './LoanList';
import LoanSummary from './LoanDashboard';

type Tab = {
  id: 'applications' | 'summary';
  label: string;
};

const tabs: Tab[] = [
  { id: 'applications', label: 'Applications' },
  { id: 'summary', label: 'Summary' },
];

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab['id']>('applications');

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Loan Management System</h1>

      <div className="border-b border-gray-200">
        <div className="flex space-x-2 max-w-[400px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'applications' ? <LoanList /> : <LoanSummary />}
      </div>
    </main>
  );
};

export default Home;
