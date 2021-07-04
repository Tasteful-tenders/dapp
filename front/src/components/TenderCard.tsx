import { BigNumber } from "ethers";
import React from "react";
import {ContractHelper, INFTData, ITender} from "../contractHelper";

export function TenderCard({nftData, tender}: {nftData: INFTData, tender: ITender}): JSX.Element {

    const currentBid: BigNumber = tender.highestBid.toNumber() !== 0 ? tender.highestBid : tender.startPrice;
    const hoursLeft: string = ((new Date(tender.endDate * 1000).getTime() - new Date().getTime()) / 3_600_000).toFixed(1);

    return (
        <div className={"w-nft_card relative font-all"}>
            <div className={"absolute bg-white w-full h-top_card grid justify-items-center border-top-nft-card shadow-xl top-0"}>
                <h3 className="flex items-center text-large font-black">{nftData.title}</h3>
                <h3 className="flex items-center text-card font-light text-grey">by {nftData.author}</h3>
            </div>
            <div className={"border-nft-card shadow-xl"}>
                <img src={'https://ipfs.io/ipfs/'+nftData.ipfsHash} alt={'image'} className="border-nft-card shadow-xl"/>
            </div>
            <div className={"absolute bg-black text-white grid grid-cols-2 h-bottom_card font-black border-bottom-nft-card shadow-xl bottom-0 w-full"}>
                <div className="col-start-1 pt-4">
                    <h3 className="grid justify-items-center text-small">Current bid</h3>
                    <h3 className="grid justify-items-center text-medium">{currentBid.toNumber()} TTK</h3>
                </div>
                <div className="col-end-0 pt-4">
                    <h3 className="grid justify-items-center text-small">Ending in</h3>
                    <h3 className="grid justify-items-center text-medium">{hoursLeft} hours</h3>
                </div>
            </div>
        </div>
    );
}