import React, {useContext} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {INFTData} from "../contractHelper";
import {TastefulData} from "../context";
import {TenderCard} from "./TenderCard";

export function Account(): JSX.Element {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const tastefulContext = useContext(TastefulData);
    const { tenders, nftsData, userNfts } = tastefulContext;

    if (!active) {
        return (
            <div>
                Please connect your wallet !
            </div>
        )
    }

    return (
        <div>
            <h1>Created :</h1>
            <div className={"grid grid-cols-5 gap-4"}>
                {userNfts && userNfts.created.map((data: INFTData, index) => {
                    return <TenderCard nftData={data} tender={tenders[data.id.toNumber()-1]} key={index}/>
                })}
            </div>
            <h1>Owned :</h1>
            <div>
                {userNfts && userNfts.owned.map((data: INFTData, index) => {
                    return <TenderCard nftData={data} tender={tenders[data.id.toNumber()-1]} key={index}/>
                })}
            </div>
        </div>
    );
}
