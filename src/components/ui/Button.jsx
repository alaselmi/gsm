export default function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  className = "",
  ...props
}) {
  const styles = {
    default: "bg-slate-700 hover:bg-slate-600 text-white",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant] || styles.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
