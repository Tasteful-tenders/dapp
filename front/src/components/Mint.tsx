import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper, INFTData, ITender} from "../contractHelper";
import {BigNumber} from "ethers";
import {TenderCard} from "./TenderCard";
import {s3} from "../constants";

export function Mint(): JSX.Element {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const contractHelper = ContractHelper.getInstance();
    const [nftData, setNftData]: [nftData: INFTData, setNftData: Function] = useState({
        id: BigNumber.from(0),
        title: '',
        author: '',
        description: '',
        ipfsHash: ''
    });
    const [tender, setTender]: [tender: ITender, setTender: Function] = useState({
        active: false,
        endDate: BigNumber.from(0),
        highestBid: BigNumber.from(0),
        highestBidder: "",
        owner: "",
        startPrice: BigNumber.from(0)
    });

    async function addFile(files: FileList|null) {
        if (files === null) {
            alert('Plz provide a valid file')
            return ;
        }
        const file = files.item(0);
        if (file === null) {
            alert('Plz provide a valid file')
            return ;
        }
        const params = {
            Bucket: 'hhk-eth-team-bucket',
            Key: `nft/${Date.now()}`,
            ContentType: file.type,
            // Body contains the uploaded file
            Body: file,
            ACL: 'public-read',
        };

        const request = s3.putObject(params);
        request.on('httpHeaders', async (statusCode: number, headers: any) => {
            console.log(headers['x-fleek-ipfs-hash']);
            setNftData({...nftData, ipfsHash: headers['x-fleek-ipfs-hash']});
        }).send();
    }

    if (!active) {
        return (
            <div>Plz connect your wallet first</div>
        );
    }

    return (
        <div className={"grid grid-cols-3 p-4"}>
            <div className={"m-auto"}>
                <TenderCard nftData={nftData} tender={tender}/>
            </div>
            <div className={"col-span-2 text-center pr-8"}>
                <label className="text-small font-bold mb-2">
                    Title
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text" onChange={e => {
                    setNftData({...nftData, title: e.target.value});
                }} placeholder="Title"/>
                <label className="text-small font-bold mb-2">
                    Author
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text" onChange={e => {
                    setNftData({...nftData, author: e.target.value});
                }} placeholder="Author"/>
                <label className="text-small font-bold mb-2">
                    Image
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="file" onChange={e => {
                        async function upload() {
                            await addFile(e.target.files);
                        }
                        upload();
                }}/>
                <label className="text-small font-bold mb-2">
                    Description
                </label>
                <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                    rows={4} onChange={e => {
                    setNftData({...nftData, description: e.target.value});
                }}/>
                <label className="text-small font-bold mb-2">
                    Start price
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number" onChange={e => {
                    setTender({...tender, startPrice: BigNumber.from(e.target.value)});
                }} placeholder="1"/>
                <label className="text-small font-bold mb-2">
                    End date
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="date" onChange={e => {
                    const timestamp = new Date(e.target.value).getTime();
                    setTender({...tender, endDate: BigNumber.from(!isNaN(timestamp) ? timestamp / 1000 : 0)});
                }}/>
                <button className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block"}
                        onClick={e => {
                            async function mint() {
                                if (contractHelper === undefined) {
                                    return;
                                }
                                await contractHelper.nftFactory.mintNft(account, JSON.stringify(nftData));
                            }
                            mint();
                        }}>Mint
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" className={"w-profile inline-block opacity-20 -mt-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <button disabled={true} className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block opacity-20"}
                        onClick={e => {
                            async function approve() {
                                if (contractHelper === undefined) {
                                    return;
                                }
                                await contractHelper.nftFactory.approve(contractHelper.auction.address, 1);
                            }
                            approve();
                        }}>Approve
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" className={"w-profile inline-block opacity-20 -mt-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <button disabled={true} className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block opacity-20"}
                        onClick={e => {
                            async function add() {
                                if (contractHelper === undefined) {
                                    return;
                                }
                                await contractHelper.auction.addNFT(1,  1, 0);
                            }
                            add();
                        }}>Create tender
                </button>
            </div>
        </div>
    );
}