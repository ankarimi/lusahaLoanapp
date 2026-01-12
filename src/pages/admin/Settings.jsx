export default function Settings() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-bold">System Settings</h1>

      {/* Lending Toggle */}
      <div className="card space-y-2">
        <p className="font-semibold">Lending Status</p>
        <p className="text-sm text-muted">Pause or resume loan applications</p>

        <button className="bg-danger w-full p-3 rounded font-semibold">
          Pause Lending
        </button>
      </div>

      {/* Interest Defaults */}
      <div className="card space-y-2">
        <p className="font-semibold">Default Interest Rate</p>
        <input type="number" placeholder="e.g. 10%" className="input" />
        <button className="btn-secondary">Save</button>
      </div>

      {/* Staff Info */}
      <div className="card">
        <p className="font-semibold">Admin Access</p>
        <p className="text-sm text-muted">
          Only Admin can add or remove staff.
        </p>
      </div>
    </div>
  );
}
