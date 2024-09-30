import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export type EventSourceStatus = "init" | "open" | "closed" | "error";

export type EventSourceEvent = Event & { data: string };

export function useEventSource(url: string, onUpdate: (data: any) => void) {
  const source = useRef<EventSource | null>(null);
  const [status, setStatus] = useState<EventSourceStatus>("init");

  useEffect(() => {
    if (url) {
      const eventSource = new EventSource(url);
      source.current = eventSource;

      eventSource.onopen = () => setStatus("open");

      eventSource.onmessage = (event: EventSourceEvent) => {
        if (status === "init") {
          setStatus("open");
        }
        if (!event) {
          return;
        }
        const result = JSON.parse(event.data);

        if (!result) {
          return;
        }
        onUpdate(result.data);
      };

      eventSource.onerror = () => setStatus("error");

      return () => {
        setStatus("closed");
        source.current = null;
        eventSource.close();
      };
    }

    setStatus("closed");

    return undefined;
  }, [url]);

  return [source.current, status] as const;
}

export const useQueryParamsState = (key: string, defaultValue?: string) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (params.get(key) === defaultValue) {
      params.delete(key);
      navigate(pathname + "?" + params.toString());
      return;
    }
  }, [pathname, searchParams]);

  const handleQueryParamUpdate = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      navigate(pathname + "?" + params.toString());
    },
    [pathname, searchParams],
  );

  return [handleQueryParamUpdate];
};
