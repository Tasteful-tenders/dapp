import { BigNumber } from "ethers";
import React from "react";
import {ContractHelper, INFTData, ITender} from "../contractHelper";

export function TenderCard({nftData, tender}: {nftData: INFTData, tender: ITender}): JSX.Element {

    const currentBid: BigNumber = tender.highestBid.toNumber() !== 0 ? tender.highestBid : tender.startPrice;
    const hoursLeft: string = ((new Date(tender.endDate * 1000).getTime() - new Date().getTime()) / 3_600_000).toFixed(1);

    return (
        <div className={"h-1/4 shadow text-center rounded-3xl"}>
            <div className={"bg-white text-black rounded-t-3xl h-12"}>
                <h3>{nftData.title}</h3>
            </div>
            <div className={""}>
                <img src={'https://ipfs.io/ipfs/'+nftData.ipfsHash} alt={'image'}/>
            </div>
            <div className={"bg-black text-white grid grid-cols-2 rounded-b-3xl"}>
                <div>
                    <h3>Current bid</h3>
                    <h3>{currentBid.toNumber()} TTK</h3>
                </div>
                <div>
                    <h3>Ending in</h3>
                    <h3>{hoursLeft} hours left</h3>
                </div>
            </div>
        </div>
    );
}