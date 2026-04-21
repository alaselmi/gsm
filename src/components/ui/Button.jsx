export default function Button({
  children,
  variant = "default",
  ...props
}) {
  const styles = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-md text-sm transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}