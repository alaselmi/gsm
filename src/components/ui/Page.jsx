export default function Page({ title, right, children }) {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {title}
        </h1>
        {right}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {children}
      </div>

    </div>
  );
}