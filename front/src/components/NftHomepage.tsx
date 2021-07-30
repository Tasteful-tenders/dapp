import React, { Component,useEffect, useRef, useState } from 'react';
import {BigNumber} from "ethers";
import nft_example from '../img/nft_example.png';
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper, INFTData} from "../contractHelper";
import { Link, useParams } from 'react-router-dom';

export function NftHomepage(): JSX.Element  {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const contractHelper = ContractHelper.getInstance();
    
    const { id } : {id: string} = useParams();

    var [nft, setNft] = useState({
        id: BigNumber.from(0),
        title: '',
        author: '',
        description: '',
        ipfsHash: '',
    });

    var [tender, setTender] = useState({
        owner: '',
        startPrice: 0,
        endDate: 0,
        highestBidder: '',
        highestBid: 0,
        active: 0,
    });
    
    useEffect(() => {   
        async function getNftData() {

            if (active) {
                if(contractHelper == undefined) 
                    return( <div></div> );

                    setNft(await contractHelper.getNftData(BigNumber.from(id)));

                    setTender(await contractHelper.auction.tenders({ id }.id));
            }
        }
        
        getNftData();

    }, [active, contractHelper]);

    return(
        <div className="grid grid-cols-3 px-32 font-all h-body py-8">
            <div className="col-start-1 w-big_nft">
                <img src={'https://ipfs.io/ipfs/' + nft.ipfsHash} alt="nft_example" className="shadow-xl border-nft-card"/>
            </div>
            <div className="col-span-2 h-full">

                <div className="grid grid-cols-2 flex items-start h-middle">
                    <div className="col-start-1 justify-items-start grid">
                        <div className="text-big uppercase font-black">{ nft.title }</div>
                        <div className="text-medium font-light text-grey">by { nft.author }</div>
                    </div>
                    <div className="col-end-3 grid justify-items-end">
                        <div className="text-big uppercase font-black">{ tender.active ? 'Not sold' : 'Sold' }</div>
                        { tender.active ? 
                            <Link className={'text-large font-light text-green'} to={'/NftAuction/' + nft.id}>
                                add new bid
                            </Link> : <div className={'font-light text-green'}>Bought by : { tender.highestBidder }</div> }
                    </div>
                </div>

                <div className="grid grid-cols-6 flex items-end h-middle pb-6">
                    <div className="col-start-1 justify-items-start grid col-span-4">
                        <div className="text-big font-black">Description</div>
                        <div className="text-large font-light text-left">{ nft.description }</div>
                    </div>
                    
                    { tender.active ? 
                        <div className="col-end-7 grid justify-items-end col-span-2">
                            <div className="text-title uppercase font-medium">Started price</div>
                            <div className="text-big font-black">{ BigNumber.from(tender.startPrice).toNumber() } TTK</div>
                        </div> : 
                        <div className="col-end-7 grid justify-items-end col-span-2">
                            <div className="text-title uppercase font-medium">Sold for</div>
                            <div className="text-big font-black">{ BigNumber.from(tender.highestBid).toNumber() } TTK</div>
                        </div> }
                </div>

            </div>
        </div>
    );
}