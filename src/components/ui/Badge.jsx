export default function Badge({ type, children }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    progress: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
    technician: "bg-cyan-50 text-cyan-700 border-cyan-200",
    user: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-md border ${styles[type] || styles.user}`}
    >
      {children}
    </span>
  );
}
