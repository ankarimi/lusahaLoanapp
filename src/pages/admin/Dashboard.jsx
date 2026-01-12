export default function Dashboard() {
  return (
    <div className="p-4 space-y-4">
      {/* Top Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-xs text-muted">Cash Available</p>
          <p className="text-lg font-bold">KSH 0</p>
        </div>

        <div className="card">
          <p className="text-xs text-muted">Active Loans</p>
          <p className="text-lg font-bold">0</p>
        </div>

        <div className="card">
          <p className="text-xs text-muted">Overdue Loans</p>
          <p className="text-lg font-bold text-danger">0</p>
        </div>

        <div className="card">
          <p className="text-xs text-muted">Pending Applications</p>
          <p className="text-lg font-bold">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <p className="font-semibold mb-2">Quick Actions</p>

        <div className="space-y-2">
          <button className="btn-secondary w-full">Review Applications</button>

          <button className="btn-secondary w-full">View Customers</button>

          <button className="btn-secondary w-full">Manage Loans</button>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <p className="font-semibold mb-1">System Status</p>
        <p className="text-sm text-muted">
          Lending is currently{" "}
          <span className="text-accent font-semibold">ACTIVE</span>
        </p>
      </div>
    </div>
  );
}
