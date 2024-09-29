import { RefObject, createContext } from "react";
import { Job } from "~/types";

type RootIndexContextsProps = {
    isJobDescShown: boolean,
    setIsJobDescShown: (val: boolean) => void,
    shownJob: Job | null,
    setShownJob: (val: Job | null) => void
}

export const RootIndexContexts = createContext<RootIndexContextsProps>({
    isJobDescShown: false,
    setIsJobDescShown: () => {},
    shownJob: null,
    setShownJob: () => {}
})

export const RootIndexProvider = RootIndexContexts.Provider