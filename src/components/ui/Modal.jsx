export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidth = "max-w-2xl",
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-8">
      <div
        className={`w-full ${maxWidth} rounded-[2rem] border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              {description ? (
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="px-6 py-6">{children}</div>

        {footer ? (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
