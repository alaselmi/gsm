export default function Table({ columns, children }) {
  return (
    <table className="w-full text-sm">

      <thead className="bg-gray-50 text-gray-500">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-6 py-3 text-left font-medium"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {children}
      </tbody>

    </table>
  );
}