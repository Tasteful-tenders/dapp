import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper, INFTData, ITender} from "../contractHelper";
import {BigNumber} from "ethers";
import {TenderCard} from "./TenderCard";

interface IActiveBids {
    tenders: ITender[];
    nftsData: INFTData[];
    allBids: any[]
}

export function Bids(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [userActiveBids, setUserActiveBids]: [IActiveBids, Function] = useState({tenders: [], nftsData: [], allBids: []});
    const contractHelper = ContractHelper.getInstance();

    useEffect(() => {
        async function fetch() {
            if (!contractHelper || !account) {
                return;
            }
            const bids: any[] = await contractHelper.fetchAllUserBids(account);
            const nftIds: BigNumber[] = bids.map((log) => {
                return log.args._nftId;
            });
            const activeBids: ITender[] = await contractHelper.fetchAllUserActiveBids(account, nftIds);
            const data: INFTData[] = await contractHelper.fetchAllNftData(nftIds);
            const allBids: any[] = await contractHelper.auction.queryFilter(contractHelper.auction.filters.logBid(nftIds));
            setUserActiveBids({
                tenders: activeBids,
                nftsData: data,
                allBids: allBids
            });
        }

        fetch();
    }, [contractHelper]);

    return (
        <div className={"px-12"}>
            {userActiveBids.tenders.map((tender, index) => {
                const nftData: INFTData = userActiveBids.nftsData[index];
                const allBids: any[] = userActiveBids.allBids.filter((log) => {
                    return log.args._nftId.toNumber() === nftData.id.toNumber();
                }).reverse();
                const userBids: any[] = allBids.filter((log) => {
                    return log.args._bidder === account;
                });
                return (
                    <div className={"grid grid-cols-4 gap-4 mb-12"} key={index}>
                        <div>
                            <TenderCard nftData={nftData} tender={tender}/>
                        </div>
                        <div className={"col-span-3"}>
                            <div className={"bg-white w-full h-top_card border-top-nft-card shadow-xl top-0"}>
                                <h3 className={"text-medium inline-block pr-2"}>{nftData.title}</h3>
                                <p className={"text-small inline-block"}>By {nftData.author}</p>
                            </div>
                            <div className={"grid grid-cols-3"}>
                                <div>
                                    <div className={"text-center text-big shadow-xl h-image_card"}>
                                        {tender.highestBid.toNumber()} TTK
                                    </div>
                                    <div className={"bg-black text-white grid grid-cols-2 h-bottom_card font-black rounded-bl-lg shadow-xl bottom-0 w-full"}>
                                        Highest Bid
                                    </div>
                                </div>
                                <div>
                                    <div className={"text-center text-big shadow-xl h-image_card"}>
                                        {userBids[0].args._bid.toNumber()} TTK
                                    </div>
                                    <div className={"bg-black text-white grid grid-cols-2 h-bottom_card font-black shadow-xl bottom-0 w-full"}>
                                        Your current Bid
                                    </div>
                                </div>
                                <div>
                                    <div className={"shadow-xl h-image_card"}>
                                        {allBids.map((log, index) => {
                                            return (
                                                <p key={index}>{log.args._bid.toNumber()}</p>
                                            );
                                        })}
                                    </div>
                                    <div className={"bg-black text-white grid grid-cols-2 h-bottom_card font-black rounded-br-lg shadow-xl bottom-0 w-full"}>
                                        Bids
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}