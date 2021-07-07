import {createContext} from "react";
import {INFTData, ITender} from "./contractHelper";

export interface ITastefulData {
    tenders: ITender[];
    nftsData: INFTData[];
    userNfts: {
        owned: INFTData[],
        created: INFTData[]
    },
    userData: IUserData,
    setTastefulData: Function
}

export interface IUserData {
    _id: string;
    address: string;
    pseudo: string;
    bio: string;
    profilePic: string;
    twitter: string;
    instagram: string;
}

export const defaultTastefulData: ITastefulData = {
    tenders: [],
    nftsData: [],
    userNfts: {
        owned: [],
        created: []
    },
    userData: {
        _id: '',
        address: '',
        pseudo: '',
        bio: '',
        profilePic: '',
        twitter: '',
        instagram: ''
    },
    setTastefulData: () => {}
}

export const TastefulData = createContext(defaultTastefulData);
export const TastefulDataProvider = TastefulData.Provider;