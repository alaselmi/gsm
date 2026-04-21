export default function Input({
  label,
  placeholder,
  type = "text",
  color = "indigo",
  onChange,
  value,
  error,
  helpText,
  className = "",
  ...props
}) {
  const colors = {
    indigo: "focus:ring-indigo-300 bg-indigo-50/30",
    sky: "focus:ring-sky-300 bg-sky-50/30",
    purple: "focus:ring-purple-300 bg-purple-50/30",
    emerald: "focus:ring-emerald-300 bg-emerald-50/30",
    amber: "focus:ring-amber-300 bg-amber-50/30",
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-gray-500">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={`
          w-full px-4 py-2 rounded-xl
          border ${error ? "border-red-200 bg-red-50/40 focus:ring-red-200" : "border-indigo-100"}
          focus:outline-none focus:ring-2
          text-gray-700
          ${error ? "" : colors[color]}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
}
