export default function BusinessDetails() {
  return (
    <section className="dashboard-card p-6">
      <div className="mb-6">
        <h2
          className="text-xl font-bold"
          style={{
            color: "var(--color-heading)",
          }}
        >
          Business Details
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: "var(--color-text-muted)",
          }}
        >
          Tax and legal information used for invoices and compliance.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            GST Number
          </label>

          <input
            placeholder="22AAAAA0000A1Z5"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            FSSAI License
          </label>

          <input
            placeholder="License Number"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            PAN Number
          </label>

          <input
            placeholder="ABCDE1234F"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            CIN (Optional)
          </label>

          <input
            placeholder="Company Identification Number"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>
      </div>
    </section>
  );
}