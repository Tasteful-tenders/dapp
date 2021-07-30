import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper, INFTData, ITender} from "../contractHelper";
import {BigNumber, providers} from "ethers";
import {TenderCard} from "./TenderCard";
import {s3} from "../constants";
import {useHistory, useParams} from "react-router-dom";
import {TxPendingModal} from "./TxPendingModal";

export function Mint(): JSX.Element {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const contractHelper = ContractHelper.getInstance();
    const history = useHistory();
    const {id}: { id: string } = useParams();
    const [approvedAddress, setApprovedAddress] = useState('0x0000000000000000000000000000000000000000');
    const [txPending, setTxPending] = useState('');

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

    useEffect(() => {
        async function fetch() {
            const nftId = BigNumber.from(id);
            if (contractHelper === undefined) return;
            if (nftId.toNumber() === 0) return;
            const nft = await contractHelper.getNftData(nftId)
            setNftData(nft);
            const approved = await contractHelper.nftFactory.getApproved(nftId)
            setApprovedAddress(approved);
            const tender: ITender = await contractHelper.auction.tenders(nftId);
            setTender(tender);
            if (tender.active) {
                history.push('/error');
            }
        }

        fetch();
    }, [id, contractHelper, approvedAddress]);

    async function addFile(files: FileList | null) {
        if (files === null) {
            alert('Plz provide a valid file')
            return;
        }
        const file = files.item(0);
        if (file === null) {
            alert('Plz provide a valid file')
            return;
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
        <>
            <TxPendingModal txPending={txPending}/>
            <div className={"grid grid-cols-3 p-4"}>
                <div className={"m-auto"}>
                    <TenderCard nftData={nftData} tender={tender}/>
                </div>
                <div className={"col-span-2 text-center pr-8"}>
                    <label className="text-small font-bold mb-2">
                        Title
                    </label>
                    {nftData.id.toNumber() === 0 &&
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" onChange={e => {
                        setNftData({...nftData, title: e.target.value});
                    }} placeholder="Title"/>}
                    {nftData.id.toNumber() !== 0 &&
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" disabled={true} value={nftData.title}/>}
                    <label className="text-small font-bold mb-2">
                        Author
                    </label>
                    {nftData.id.toNumber() === 0 &&
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" onChange={e => {
                        setNftData({...nftData, author: e.target.value});
                    }} placeholder="Author"/>}
                    {nftData.id.toNumber() !== 0 &&
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" disabled={true} value={nftData.author}/>}
                    <label className="text-small font-bold mb-2">
                        Image
                    </label>
                    {nftData.id.toNumber() === 0 &&
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="file" onChange={e => {
                        async function upload() {
                            await addFile(e.target.files);
                        }
                        upload();
                    }}/>}
                    {nftData.id.toNumber() !== 0 &&
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" disabled={true} value={'IPFS hash : ' + nftData.ipfsHash}/>}
                    <label className="text-small font-bold mb-2">
                        Description
                    </label>
                    {nftData.id.toNumber() === 0 &&
                    <textarea
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        rows={4} onChange={e => {
                        setNftData({...nftData, description: e.target.value});
                    }}/>}
                    {nftData.id.toNumber() !== 0 &&
                    <textarea
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        rows={4} disabled={true} value={nftData.description}/>}
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
                        type="datetime-local" onChange={e => {
                        const timestamp = new Date(e.target.value).getTime();
                        setTender({...tender, endDate: BigNumber.from(!isNaN(timestamp) ? timestamp / 1000 : 0)});
                    }}/>
                    {nftData.id.toNumber() === 0 &&
                    <button
                        className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block"}
                        onClick={e => {
                            async function mint() {
                                if (contractHelper === undefined || connector === undefined || !account) {
                                    return;
                                }
                                const tx = await contractHelper.nftFactory.mintNft(account, JSON.stringify(nftData));
                                setTxPending(tx.hash);
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                const mined = await web3Provider.waitForTransaction(tx.hash, 3);
                                setTxPending('');
                                if (mined) {
                                    const ownedNftIds = await contractHelper.fetchOwnedNftIds(account);
                                    history.push('/mint/' + ownedNftIds[ownedNftIds.length - 1]);
                                }
                            }
                            mint();
                        }}>Mint
                    </button>}
                    {nftData.id.toNumber() !== 0 &&
                    <button
                        className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block opacity-20"}
                        disabled={true}>Mint
                    </button>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={"w-profile inline-block opacity-20 -mt-2"}
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                    {nftData.id.toNumber() !== 0 && contractHelper && approvedAddress !== contractHelper.auction.address ?
                        <button
                            className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block"}
                            onClick={e => {
                                async function approve() {
                                    if (contractHelper === undefined || connector === undefined) {
                                        return;
                                    }
                                    const tx = await contractHelper.nftFactory.approve(contractHelper.auction.address, nftData.id);
                                    setTxPending(tx.hash);
                                    const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                    const mined = await web3Provider.waitForTransaction(tx.hash, 3);
                                    setTxPending('');
                                    if (mined) {
                                        setApprovedAddress(await contractHelper.nftFactory.getApproved(nftData.id));
                                    }
                                }
                                approve();
                            }}>Approve
                        </button>
                        :
                        <button disabled={true}
                                className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block opacity-20"}>
                            Approve
                        </button>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={"w-profile inline-block opacity-20 -mt-2"}
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                    {nftData.id.toNumber() !== 0 && contractHelper && approvedAddress === contractHelper.auction.address ?
                        <button
                            className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block"}
                            onClick={e => {
                                async function add() {
                                    if (contractHelper === undefined || connector === undefined) {
                                        return;
                                    }
                                    const tx = await contractHelper.auction.addNFT(nftData.id, tender.startPrice, tender.endDate);
                                    setTxPending(tx.hash);
                                    const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                    const mined = await web3Provider.waitForTransaction(tx.hash, 3);
                                    setTxPending('');
                                    if (mined) {
                                        history.push('/nftHomepage/'+id);
                                    }
                                }

                                if (tender.startPrice.toNumber() > 0 && tender.endDate.toNumber() > (new Date().getTime() / 1000) + (3600 * 24) - 1) {
                                    add();
                                } else {
                                    alert('Plz enter valid start price and end date');
                                }
                            }}>Create tender
                        </button>
                        :
                        <button disabled={true}
                                className={"mt-6 bg-black text-white px-9 border-rounded font-medium text-medium inline-block opacity-20"}>
                            Create tender
                        </button>}
                </div>
            </div>
        </>
    );
}