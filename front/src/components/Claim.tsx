import React, { Component,useEffect, useRef, useState } from 'react';
import {BigNumber} from "ethers";
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper, INFTData, ITender} from "../contractHelper";
import { Link, useParams } from 'react-router-dom';
import {TenderCard} from "./TenderCard";

export function Claim(): JSX.Element  {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const contractHelper = ContractHelper.getInstance();

    const [allNfts, setAllNfts]: any[] = useState([]);
    const { address } : {address: string} = useParams();

    useEffect(() => {   
        async function getNftData() {
            if (active) {
                if(contractHelper == undefined) 
                    return( <div></div> );
                    
                const bids: any[] = await contractHelper.fetchAllUserBids(address);
                const nftIds: BigNumber[] = bids.map((log) => {
                    return log.args._nftId;
                }).sort().filter(function (item, pos, ary) {
                    return !pos || item.toNumber() != ary[pos - 1].toNumber();
                });
                const activeBids: ITender[] = await contractHelper.fetchAllUserActiveBids(address, nftIds);

                const allNfts = [];
                for(let i=0; i< activeBids.length; i++){
                    const date = new Date(activeBids[i].endDate.toNumber() * 1000).getTime();

                    if( activeBids[i].highestBidder == address && date < new Date().getTime()) {
                        allNfts.push(await contractHelper.getNftData(nftIds[i]));
                    }
                }
                setAllNfts(allNfts);
            }
        }

        getNftData();
    }, [active, contractHelper]);

    const claimBid = async (NftId: BigNumber) => {
        const contractHelper = ContractHelper.getInstance();

        if (active) {
            if(contractHelper == undefined) 
                return( <div></div> );

            let claim = await contractHelper.auction.claim(NftId.toNumber());

        }
    }

    return(
        <div>
            <div className={"text-black font-black uppercase text-big grid justify-items-center"}>Claim your nfts</div>
            {allNfts.map((nft: any, index: number) => {
                return (
                    <div key={index} className={"w-nft_card relative font-all cursor-pointer"} onClick={() => claimBid(nft.id)}>
                        <div className={"bg-white w-full h-top_card grid justify-items-center border-top-nft-card shadow-xl top-0"}>
                            <h3 className="flex items-center text-large font-black">{nft.title}</h3>
                            <h3 className="flex items-center text-card font-light text-grey">by {nft.author}</h3>
                        </div>
                        <div className={"shadow-xl h-image_card"}>
                            <img src={'https://ipfs.io/ipfs/' + nft.ipfsHash} alt={'image'}
                                 className="shadow-xl transform max-h-image_card m-auto"/>
                        </div>
                        <div className={"flex flex-wrap content-center bg-black text-white grid h-bottom_card justify-items-center font-black border-bottom-nft-card shadow-xl bottom-0 w-full uppercase text-title"}>
                            Claim
                        </div>
                    </div>
                );
            })}
        </div>
    );
}