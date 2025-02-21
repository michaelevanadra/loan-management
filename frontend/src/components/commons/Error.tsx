const Error: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-red-600">
      <p>{error}</p>
    </div>
  );
};

export default Error;
