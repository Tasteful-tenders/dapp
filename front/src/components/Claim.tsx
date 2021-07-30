import React, {Component, useEffect, useRef, useState} from 'react';
import {BigNumber} from "ethers";
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper, INFTData, ITender} from "../contractHelper";
import {Link, useParams} from 'react-router-dom';

export function Claim(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const contractHelper = ContractHelper.getInstance();

    const [allNfts, setAllNfts]: any[] = useState([]);
    const {address}: { address: string } = useParams();

    useEffect(() => {
        async function getNftData() {
            if (active) {
                if (contractHelper == undefined)
                    return (<div></div>);

                const bids: any[] = await contractHelper.fetchAllUserBids(address);
                const nftIds: BigNumber[] = bids.map((log) => {
                    return log.args._nftId;
                }).sort().filter(function (item, pos, ary) {
                    return !pos || item.toNumber() != ary[pos - 1].toNumber();
                });
                const nftTenders: ITender[] = await contractHelper.fetchAllTenders(nftIds);
                const claimableNftIds = nftIds.filter((id, index) => {
                    return nftTenders[index].active && nftTenders[index].highestBidder === account && nftTenders[index].endDate.toNumber() * 1000 < new Date().getTime();
                });
                const claimableNftsData = await contractHelper.fetchAllNftData(claimableNftIds);
                setAllNfts(claimableNftsData);
            }
        }

        getNftData();
    }, [active, contractHelper]);

    const claimBid = async (NftId: BigNumber) => {
        const contractHelper = ContractHelper.getInstance();

        if (active) {
            if (contractHelper == undefined)
                return (<div></div>);

            let claim = await contractHelper.auction.claim(NftId.toNumber());

        }
    }

    return (
        <div>
            <div className={"text-black font-black uppercase text-big grid justify-items-center"}>Claim your nfts</div>
            <div className={"grid grid-cols-5 gap-4 p-4"}>
                {allNfts.map((nft: any, index: number) => {
                    return (
                        <div key={index} className={"w-nft_card relative font-all cursor-pointer"}
                             onClick={() => claimBid(nft.id)}>
                            <div
                                className={"bg-white w-full h-top_card grid justify-items-center border-top-nft-card shadow-xl top-0"}>
                                <h3 className="flex items-center text-large font-black">{nft.title}</h3>
                                <h3 className="flex items-center text-card font-light text-grey">by {nft.author}</h3>
                            </div>
                            <div className={"shadow-xl h-image_card"}>
                                <img src={'https://ipfs.io/ipfs/' + nft.ipfsHash} alt={'image'}
                                     className="shadow-xl transform max-h-image_card m-auto"/>
                            </div>
                            <div
                                className={"flex flex-wrap content-center bg-black text-white grid h-bottom_card justify-items-center font-black border-bottom-nft-card shadow-xl bottom-0 w-full uppercase text-title"}>
                                Claim
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}