import {Web3Provider} from "@ethersproject/providers";
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import React, { Component, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContractHelper } from '../contractHelper';

import nft_example from '../img/nft_example.png';

export function NftAuction(): JSX.Element{
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
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
    var [bidAmount, setBidAmount] = useState(0);
    var [allBids, setAllBids]: any[] = useState();
    let higherBidder: boolean = false;

    useEffect(() => {   
        async function getNftData() {
            const contractHelper = ContractHelper.getInstance();

            if (active) {
                if(contractHelper == undefined) 
                    return( <div></div> );

                setNft(await contractHelper.getNftData(BigNumber.from(id)));
                setTender(await contractHelper.auction.tenders({ id }.id));
                
                setAllBids(await contractHelper.fetchAllBids(BigNumber.from(id)));
            }
        }

        getNftData();
    }, [active]);

    const addNewBid = async () => {
        const contractHelper = ContractHelper.getInstance();

        if (active) {
            if(contractHelper == undefined) 
                return( <div></div> );
            const allowance = await contractHelper.tendersToken.allowance(account, contractHelper.auction.address);

            if (allowance.toNumber() <= bidAmount) {
                let approve = await contractHelper.tendersToken.approve(contractHelper.auction.address, bidAmount);

                approve.wait().then(async () => {
                    let bid = await contractHelper.auction.bid(id, bidAmount);
                });
            }
        }
    }
    
    if(account === tender.highestBidder)
        higherBidder = true;

    return(
        <div className="grid grid-cols-3 px-32 font-all h-body py-8">
            
            <div className="col-start-1 w-big_nft">
                <Link className={''} to={'/NftHomepage'}>
                    <img src={'https://ipfs.io/ipfs/' + nft.ipfsHash} alt="nft_example" className="shadow-xl border-nft-card"/>
                </Link>
            </div>
            <div className="col-span-2 h-full grid-rows-3 grid">

                <div className="grid grid-cols-2 flex items-start h-middle row-end-1 row-span-2">
                    <div className="col-start-1 justify-items-start grid">
                        <div className="text-big uppercase font-black">{ nft.title }</div>
                        <div className="text-medium font-light text-grey">by { nft.author }</div>
                    </div>
                    <div className="col-end-3 grid justify-items-end">
                        <div className="text-big uppercase font-black">Highest bidder</div>
                        <div className="text-big font-black text-green">{ BigNumber.from(tender.highestBid).toNumber() } TTK</div>

                        { higherBidder ? <div className="text-large font-light text-grey">Your currently the higher bidder</div> : <div></div> }

                    </div>
                </div>

                <div className="row-span-3 text-white flex flex-col gap-4 overflow-y-scroll h-85 w-middle">

                    {allBids?.slice(0).reverse().map((element: any, key: any)=>{  
                        let timestamp = element.args._timestamp.toNumber();  
                        let date = new Date(timestamp * 1000)
                        return (
                            <div className="w-bid_card bg-white h-bid_card border-button grid grid-cols-4 gap-4 flex content-center text-black shadow-md">
                                <div className="col-start-1 col-end-3 pl-6">
                                    <div><span className="font-bold text-medium">Bid placed by </span><span className="text-card">{ element.args._bidder }</span></div>
                                    <div className="text-small">{ date.getDate()+ "/"+(date.getMonth()+1)+ "/"+date.getFullYear()+ " "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds() }</div>
                                </div>
                                <div className="col-end-5 col-span-2 grid justify-items-end flex content-center text-large font-bold pr-6">{ element.args._bid.toNumber() } TTK</div>
                            </div>
                        )
                    })}

                </div>

                <div className="grid grid-cols-2 flex items-end h-middle row-end-5 pb-6">
                    <div className="col-start-1 justify-items-start grid col-span-4 w-full">
                        <div className="font-light">Wallet : 15000 TTK</div>
                        <div className="py-3 w-middle">
                            <input type="number" className="font-light focus:outline-none text-gray-700 px-3 py-1 border-color-black w-bid_card" value={ bidAmount } onChange={ e => setBidAmount(parseInt(e.target.value)) } placeholder="bid's amount"/>
                        </div>
                        <button className="bg-black text-white px-3 py-2 focus:outline-none font-light border-button" onClick={ addNewBid }>Add new bid</button> 
                    </div>
                    <div className="col-end-7 grid justify-items-end col-span-2">
                        <div className="text-title uppercase font-medium">Started price</div>
                        <div className="text-big font-black">{ BigNumber.from(tender.startPrice).toNumber() } TTK</div>
                    </div>
                </div>

            </div>
        </div>
    );
}