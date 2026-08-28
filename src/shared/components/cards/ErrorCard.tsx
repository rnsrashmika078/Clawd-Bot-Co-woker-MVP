function ErrorCard({ name, error }: { name?: string; error?: string }) {
  if (!error) return;
  return (
    <div className="sticky bottom-24 left-0 -translate-y-1/2  block rounded-lg border text-black border-red-500  p-4">
      <span className="font-semibold text-red-700">{error}</span>
      {/* <p className="text-sm text-red-600">{error}</p> */}
    </div>
  );
}
export default ErrorCard;
