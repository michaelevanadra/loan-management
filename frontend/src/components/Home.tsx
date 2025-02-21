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
    <main className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Loan Management System</h1>

      <div className="border-b border-gray-200">
        <div className="flex max-w-[400px] space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary text-primary border-b-2'
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
