import {createContext} from "react";
import {INFTData, ITender} from "./contractHelper";

export interface ITastefulData {
    tenders: ITender[];
    nftsData: INFTData[];
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
    setTastefulData: () => {}
}

export const TastefulData = createContext(defaultTastefulData);
export const TastefulDataProvider = TastefulData.Provider;