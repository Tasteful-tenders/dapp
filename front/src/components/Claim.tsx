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

    var [allNft, setAllNfts]: any[] = useState({
        id: BigNumber.from(0),
        title: '',
        author: '',
        description: '',
        ipfsHash: '',
    });
    const { address } : {address: string} = useParams();

    useEffect(() => {   
        async function getNftData() {
            const contractHelper = ContractHelper.getInstance();

            if (active) {
                if(contractHelper == undefined) 
                    return( <div></div> );
                    
                const bids: any[] = await contractHelper.fetchAllUserBids(address);
                const nftIds: BigNumber[] = bids.map((log) => {
                    return log.args._nftId;
                });
                const activeBids: ITender[] = await contractHelper.fetchAllUserActiveBids(address, nftIds);

                for(let i=0; i< activeBids.length; i++){
                    var date = activeBids[i].endDate.toNumber() + 7200;
                    var today = Math.floor(Date.now() / 1000) + 7200;

                    if( activeBids[i].highestBidder == address && today > date) {
                        setAllNfts(await contractHelper.getNftData(nftIds[i]));
                    }
                }
            }
        }

        getNftData();
    }, [active]);

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
            <div className={"w-nft_card relative font-all cursor-pointer"} onClick={() => claimBid(allNft.id)}>
                <div className={"bg-white w-full h-top_card grid justify-items-center border-top-nft-card shadow-xl top-0"}>
                    <h3 className="flex items-center text-large font-black">{allNft.title}</h3>
                    <h3 className="flex items-center text-card font-light text-grey">by {allNft.author}</h3>
                </div>
                <div className={"shadow-xl h-image_card"}>
                    <img src={'https://ipfs.io/ipfs/' + allNft.ipfsHash} alt={'image'}
                            className="shadow-xl transform max-h-image_card m-auto"/>
                </div>
                <div className={"flex flex-wrap content-center bg-black text-white grid h-bottom_card justify-items-center font-black border-bottom-nft-card shadow-xl bottom-0 w-full uppercase text-title"}>
                    Claim
                </div>
            </div>
        </div>
    );
}