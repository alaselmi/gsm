import { X } from "lucide-react";

export default function HistoryModal({ history, onClose }) {
  const getColor = (type) => {
    if (type === "CREATED") return "bg-gray-400";
    if (type === "STATUS_UPDATED") return "bg-blue-500";
    if (type === "DELIVERED") return "bg-green-500";
    return "bg-gray-300";
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-6">
          Repair History
        </h2>

        {/* Timeline */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">

          {history?.length ? (
            history.map((item, index) => (
              <div key={index} className="flex gap-3">

                {/* Dot */}
                <div className={`w-3 h-3 mt-2 rounded-full ${getColor(item.type)}`} />

                {/* Content */}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.details}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.date}
                  </p>
                </div>

              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No history available
            </p>
          )}

        </div>

      </div>

    </div>
  );
}