import { createContext, useContext, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const ToastContext = createContext();

const toneStyles = {
  success: {
    wrapper: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-900",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50",
    title: "text-amber-900",
    text: "text-amber-700",
    icon: TriangleAlert,
  },
  info: {
    wrapper: "border-slate-200 bg-white",
    title: "text-slate-900",
    text: "text-slate-600",
    icon: Info,
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = ({ title, description, tone = "info" }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setToasts((current) => [...current, { id, title, description, tone }]);
    window.setTimeout(() => removeToast(id), 3600);

    return id;
  };

  const value = {
    pushToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-full max-w-sm flex-col gap-3 px-4">
        {toasts.map((toast) => {
          const style = toneStyles[toast.tone] || toneStyles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-3xl border p-4 shadow-lg ${style.wrapper}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon size={18} className={style.text} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${style.title}`}>
                    {toast.title}
                  </p>
                  {toast.description ? (
                    <p className={`mt-1 text-sm ${style.text}`}>
                      {toast.description}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-full p-1 text-slate-400 transition hover:bg-white/70 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
