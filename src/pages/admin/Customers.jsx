export default function Customers() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Customers</h1>

      <div className="card">
        <p className="font-semibold">John Mwangi</p>
        <p className="text-sm text-muted">Phone: 07XXXXXXXX</p>
        <p className="text-sm text-muted">Trust Level: Trusted</p>

        <button className="btn-secondary mt-3 w-full">View Profile</button>
      </div>

      {/* Later: searchable list */}
    </div>
  );
}
