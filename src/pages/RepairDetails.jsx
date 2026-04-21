export default function RepairDetails({ repair }) {
  return (
    <div className="space-y-5">

      <div className="bg-white p-5 rounded-2xl border">

        <h1 className="text-xl font-bold text-indigo-600">
          Repair Details
        </h1>

        <p className="text-gray-600">Client: {repair.client}</p>
        <p className="text-gray-600">Device: {repair.device}</p>

      </div>

      <div className="bg-white p-5 rounded-2xl border">

        <h2 className="font-bold text-gray-700 mb-3">
          Timeline
        </h2>

        {repair.timeline?.map((t, i) => (
          <div
            key={i}
            className="border-l-4 border-indigo-300 pl-3 mb-3"
          >
            <p className="text-sm text-gray-700">{t.message}</p>
            <p className="text-xs text-indigo-400">{t.date}</p>
          </div>
        ))}

      </div>

    </div>
  );
}