import React from "react";
import {ContractHelper, INFTData, ITender} from "../contractHelper";

export function TenderCard({nftData, tender}: {nftData: INFTData, tender: ITender}): JSX.Element {
    return (
        <div className={""}>
            <img src={'https://ipfs.io/ipfs/'+nftData.ipfsHash} alt={'image'}/>
        </div>
    );
}