import React, {useContext, useEffect} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper, INFTData} from "../contractHelper";
import {TastefulData} from "../context";

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
            <h1>Created</h1>
            {userNfts && userNfts.created.map((nft: INFTData, index) => {
                return (
                    <div key={index}>
                        {nft.id}
                    </div>
                );
            })}
            <h1>Owned</h1>
            {userNfts && userNfts.owned.map((nft: INFTData, index) => {
                return (
                    <div key={index}>
                        {nft.id}
                    </div>
                );
            })}
        </div>
    );
}
