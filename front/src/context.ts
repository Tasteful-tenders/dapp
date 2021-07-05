import {createContext} from "react";
import {INFTData, ITender} from "./contractHelper";

interface ITastefulData {
    tenders: ITender[];
    nftsData: INFTData[];
    userNfts: {
        owned: INFTData[],
        created: INFTData[]
    }
}

const tastefulData: ITastefulData = {
    tenders: [],
    nftsData: [],
    userNfts: {
        owned: [],
        created: []
    }
}

export const TastefulData = createContext(tastefulData);
export const TastefulDataProvider = TastefulData.Provider;