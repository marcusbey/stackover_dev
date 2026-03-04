import { useReducer, useCallback, useRef, useEffect } from "react";

type State = { activeKey: string | null };
type Action =
  | { type: "OPEN"; key: string }
  | { type: "CLOSE" }
  | { type: "TOGGLE"; key: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN":
      return { activeKey: action.key };
    case "CLOSE":
      return { activeKey: null };
    case "TOGGLE":
      return {
        activeKey: state.activeKey === action.key ? null : action.key,
      };
  }
}

export function useMegaNav() {
  const [state, dispatch] = useReducer(reducer, { activeKey: null });
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const open = useCallback((key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    dispatch({ type: "OPEN", key });
  }, []);

  const close = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    dispatch({ type: "CLOSE" });
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(
      () => dispatch({ type: "CLOSE" }),
      150,
    );
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const toggle = useCallback((key: string) => {
    dispatch({ type: "TOGGLE", key });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  return {
    activeKey: state.activeKey,
    open,
    close,
    scheduleClose,
    cancelClose,
    toggle,
  };
}
