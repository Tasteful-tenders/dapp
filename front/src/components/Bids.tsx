import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper, INFTData, ITender} from "../contractHelper";
import {BigNumber} from "ethers";
import {TenderCard} from "./TenderCard";
import { Link } from "react-router-dom";

interface IActiveBids {
    tenders: ITender[];
    nftsData: INFTData[];
    allBids: any[]
}

export function Bids(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [userActiveBids, setUserActiveBids]: [IActiveBids, Function] = useState({
        tenders: [],
        nftsData: [],
        allBids: []
    });
    const contractHelper = ContractHelper.getInstance();

    useEffect(() => {
        async function fetch() {
            if (!contractHelper || !account) {
                return;
            }
            const bids: any[] = await contractHelper.fetchAllUserBids(account);
            const nftIds: BigNumber[] = bids.map((log) => {
                return log.args._nftId;
            }).sort().filter(function (item, pos, ary) {
                return !pos || item.toNumber() != ary[pos - 1].toNumber();
            });
            const allTenders = await contractHelper.fetchAllTenders(nftIds);
            const activeNftIds = nftIds.filter((id, index) => {
                return allTenders[index].endDate.toNumber() * 1000 > new Date().getTime();
            });
            const activeTender: ITender[] = await contractHelper.fetchAllTenders(activeNftIds);
            const activeNftData: INFTData[] = await contractHelper.fetchAllNftData(activeNftIds);
            const allBids: any[] = await contractHelper.auction.queryFilter(contractHelper.auction.filters.logBid(activeNftIds));
            setUserActiveBids({
                tenders: activeTender,
                nftsData: activeNftData,
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
                            <div className={"bg-white w-full h-top_card border-top-nft-card shadow-xl p-6"}>
                                <h3 className={"text-medium inline-block pr-2"}>{nftData.title}</h3>
                                <p className={"text-small inline-block"}>By {nftData.author}</p>
                                <p className={"text-small inline-block float-right underline"}>
                                    <Link to={"/nftHomepage/"+nftData.id}>go to tender</Link>
                                </p>
                            </div>
                            <div className={"grid grid-cols-3"}>
                                <div>
                                    <div className={"text-center text-big shadow-xl h-image_card pt-24"}>
                                        {tender.highestBid.toNumber()} TTK
                                    </div>
                                    <div
                                        className={"text-center text-large bg-black text-white h-bottom_card font-black rounded-bl-lg shadow-xl p-6"}>
                                        Highest Bid
                                    </div>
                                </div>
                                <div>
                                    <div className={"text-center shadow-xl h-image_card pt-24"}>
                                        <h3 className={"text-big"}>{userBids[0].args._bid.toNumber()} TTK</h3>
                                        {userBids[0].args._bid.toNumber() === tender.highestBid.toNumber() ?
                                            <span>(you are the highest bidder)</span> : ''}
                                    </div>
                                    <div
                                        className={"text-center text-large bg-black text-white h-bottom_card font-black shadow-xl pt-6"}>
                                        Your current Bid
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className={"shadow-xl h-image_card text-center grid gap-4 p-4 overflow-y-auto"}>
                                        {allBids.map((log, index) => {
                                            const bidDate = new Date(log.args._timestamp.toNumber() * 1000);
                                            return (
                                                <div key={index}
                                                     className="bg-white h-bid_card rounded-xl grid grid-cols-5 gap-4 content-center text-black shadow-md">
                                                    <div className="col-start-1 col-end-4 pl-6">
                                                        <div><span
                                                            className="font-bold text-medium">Bid placed by </span>{'0x..' + log.args._bidder.slice(39)}
                                                        </div>
                                                        <div
                                                            className="text-small">{bidDate.toDateString()} at {bidDate.getHours() + 'H' + bidDate.getMinutes()}</div>
                                                    </div>
                                                    <div
                                                        className="col-span-2 grid justify-items-end content-center text-medium font-bold pr-6">{log.args._bid.toNumber()} TTK
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div
                                        className={"text-center text-large bg-black text-white h-bottom_card font-black rounded-br-lg shadow-xl pt-6"}>
                                        Recent bids
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