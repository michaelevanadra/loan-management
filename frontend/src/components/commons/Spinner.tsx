import { Loader2 } from 'lucide-react';

const Spinner: React.FC = () => {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );
};

export default Spinner;
