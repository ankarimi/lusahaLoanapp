export default function Applications() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Loan Applications</h1>

      {/* Application Card */}
      <div className="card space-y-2">
        <p className="font-semibold">Jane Doe</p>
        <p className="text-sm text-muted">Requested: KSH 50,000</p>
        <p className="text-sm text-muted">Trust Level: New</p>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 btn-secondary">View</button>
          <button className="flex-1 bg-accent text-black p-2 rounded">
            Approve
          </button>
          <button className="flex-1 bg-danger p-2 rounded">Deny</button>
        </div>
      </div>

      {/* Empty state ready */}
      {/* Later replace cards with Firestore map */}
    </div>
  );
}
