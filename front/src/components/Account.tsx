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
        <div className={"grid grid-cols-3 m-2"}>
            <div className={"p-12"}>
                <img className={"m-auto border-nft-card"} src={"https://via.placeholder.com/250"} alt={"img"}/>
                <h3 className={"text-medium font-black break-words"}>{account}</h3>
                <h3>twitter</h3>
                <h3>instagram</h3>
            </div>
            <div className={"col-span-2"}>
                <div className={"w-two_third mb-8"}>
                    <h3 className={"text-large font-black mb-4"}>BIO</h3>
                    <p>Use the col-start-n and col-end-n utilities to make an element start or end at the nth grid line.
                        These can also be combined with the col-span-n utilities to span a specific number of columns.

                        Note that CSS grid lines start at 1, not 0,
                        so a full-width element in a 6-column grid would start at line 1 and end at line 7.</p>
                </div>
                <div>
                    <div className={"grid grid-cols-8"}>
                        <div><h3 className={"text-large font-black mb-4"}>My NFTs</h3></div>
                        <div className={"col-span-7 border-b-2 -ml-4 mr-16 mb-9"}> </div>
                    </div>
                    <div className={"grid grid-cols-5 gap-4"}>
                        {userNfts && userNfts.created.map((data: INFTData, index) => {
                            return <TenderCard nftData={data} tender={tenders[data.id.toNumber()-1]} key={index}/>
                        })}
                    </div>
                    <div>
                        {userNfts && userNfts.owned.map((data: INFTData, index) => {
                            return <TenderCard nftData={data} tender={tenders[data.id.toNumber()-1]} key={index}/>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
