import {createContext} from "react";

const tastefulData = {
    tenders: [],
    nftsData: []
}

export const TastefulData = createContext(tastefulData);
export const TastefulDataProvider = TastefulData.Provider;