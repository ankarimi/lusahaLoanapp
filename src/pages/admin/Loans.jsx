export default function Loans() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Loans</h1>

      <div className="card space-y-1">
        <p className="font-semibold">Mary Wanjiku</p>
        <p className="text-sm text-muted">Amount: KSH 120,000</p>
        <p className="text-sm text-muted">
          Status: <span className="text-danger font-semibold">Overdue</span>
        </p>

        <button className="btn-secondary mt-2 w-full">Record Payment</button>
      </div>

      {/* Later: tabs for Active / Overdue / Settled */}
    </div>
  );
}
