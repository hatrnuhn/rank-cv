import { FetcherWithComponents, useFetcher } from "@remix-run/react";
import { AppData } from "@remix-run/react/dist/data";
import { useContext, useEffect, useState } from "react";
import { RootIndexContexts } from "~/contexts";

export type FetcherWithComponentsReset<T> = FetcherWithComponents<T> & {
    reset: () => void;
};
  
export function useFetcherWithReset<T = AppData>(): FetcherWithComponentsReset<T> {
    const fetcher = useFetcher<T>();
    const [data, setData] = useState(fetcher.data);
    useEffect(() => {
      if (fetcher.state === "idle") {
        setData(fetcher.data);
      }
    }, [fetcher.state, fetcher.data]);
    return {
      ...fetcher as FetcherWithComponents<T>,
      data: data as T,
      reset: () => setData(undefined),
    };
  }

export const useRootIndexContext = () => {
  return useContext(RootIndexContexts)
}