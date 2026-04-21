import { useCallback, useEffect } from "react";

export function useUnsavedChangesWarning(
  isDirty,
  message = "You have unsaved changes. Leave without saving?"
) {
  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, message]);

  return useCallback(
    (action) => {
      if (!isDirty || window.confirm(message)) {
        action();
      }
    },
    [isDirty, message]
  );
}
