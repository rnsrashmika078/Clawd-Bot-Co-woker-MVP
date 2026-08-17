function ErrorCard({ name, error }: { name?: string; error?: string }) {
  if (!error) return;
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4">
      <h3 className="font-semibold text-red-700">{error}</h3>
      {/* <p className="text-sm text-red-600">{error}</p> */}
    </div>
  );
}
export default ErrorCard;
