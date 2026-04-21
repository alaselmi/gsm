export default function Select({
  label,
  options = [],
  onChange,
  color = "emerald",
}) {
  const bg = {
    emerald: "bg-emerald-50/30 focus:ring-emerald-300",
    indigo: "bg-indigo-50/30 focus:ring-indigo-300",
  };

  return (
    <div className="space-y-1">

      {label && (
        <label className="text-sm text-gray-500">
          {label}
        </label>
      )}

      <select
        onChange={onChange}
        className={`
          w-full px-4 py-2 rounded-xl
          border border-indigo-100
          focus:outline-none focus:ring-2
          text-gray-600
          ${bg[color]}
        `}
      >
        <option value="">Select...</option>

        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

    </div>
  );
}