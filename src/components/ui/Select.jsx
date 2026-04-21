export default function Select({
  label,
  options = [],
  onChange,
  value,
  color = "emerald",
  error,
  helpText,
  className = "",
  ...props
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
        value={value}
        className={`
          w-full px-4 py-2 rounded-xl
          border ${error ? "border-red-200 bg-red-50/40 focus:ring-red-200" : "border-indigo-100"}
          focus:outline-none focus:ring-2
          text-gray-600
          ${error ? "" : bg[color]}
          ${className}
        `}
        {...props}
      >
        <option value="">Select...</option>

        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-gray-500">{helpText}</p>
      ) : null}

    </div>
  );
}
