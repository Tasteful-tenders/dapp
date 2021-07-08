import React, {useContext, useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper, INFTData} from "../contractHelper";
import {IUserData, TastefulData} from "../context";
import {TenderCard} from "./TenderCard";
import twitter from './../img/twitter.png';
import instagram from './../img/instagram.png';
import ModifyAccountModal from "./ModifyAccountModal";
import { useParams } from "react-router-dom";

export function Account(): JSX.Element {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const tastefulContext = useContext(TastefulData);
    const {tenders, nftsData } = tastefulContext;
    let [isOpen, setIsOpen] = useState(false);
    let [accountData, setAccountData] : [accountData: IUserData, setAccountData: Function] = useState({
        _id: "",
        address: "",
        bio: "",
        instagram: "",
        profilePic: "",
        pseudo: "",
        twitter: ""
    });
    let [accountNfts, setAccountNfts]: [accountNfts: {created: INFTData[], owned: INFTData[]}, setAccountNfts: Function] = useState({
        owned: [],
        created: []
    })

    const { address } : {address: string} = useParams();
    const contractHelper = ContractHelper.getInstance();

    useEffect(() => {
        async function fetchUserData() {
            if (contractHelper === undefined) return;
            let owned, created: any = [];
            try {
                owned = await contractHelper.fetchAllNftData(await contractHelper.fetchOwnedNftIds(address));
                created = await contractHelper.fetchAllNftData(await contractHelper.fetchCreatedNftIds(address));
            }
            catch (e) {
                console.log('Invalid address in url !');
                return;
            }
            const rawResponse = await fetch(`http://localhost:4000/user/get/${address}`, {
                method: 'GET',
            });
            const accountData = await rawResponse.json();
            setAccountData(accountData);
            setAccountNfts({
                owned: owned,
                created: created
            });
        }
        fetchUserData();
    }, [address, contractHelper]);

    function openModal() {
        setIsOpen(true)
    }

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
                <img className={"m-auto border-nft-card w-profile_pic"} src={accountData.profilePic !== undefined ? accountData.profilePic : "https://via.placeholder.com/250"} alt={"img"}/>
                <h3 className={"text-medium font-black break-words my-8 text-center"}>{accountData.pseudo !== undefined ? accountData.pseudo : address}</h3>
                <div className={"mt-32"}>
                    <a className={"block mb-4"} href={"https://twitter.com/" + accountData.twitter} target={"_blank"}>
                        <img className={"h-logo inline-block mr-12"} src={twitter} alt={'logo'}/>
                        <h3 className={"inline-block text-medium"}>{accountData.twitter !== undefined ? '@' + accountData.twitter : 'No account'}</h3>
                    </a>
                    <a className={"block"} href={"https://instagram.com/" + accountData.instagram} target={"_blank"}>
                        <img className={"h-logo inline-block mr-12 -mt-2"} src={instagram} alt={'logo'}/>
                        <h3 className={"inline-block text-medium"}>{accountData.instagram !== undefined ? '@' + accountData.instagram : 'No account'}</h3>
                    </a>
                </div>
                {account === address ? <button onClick={openModal}>Update profile</button> : <></>}
            </div>
            <div className={"col-span-2"}>
                <div className={"w-two_third mb-8"}>
                    <h3 className={"text-large font-black mb-4"}>BIO</h3>
                    <p>{accountData.bio ? accountData.bio : 'No bio'}</p>
                </div>
                <div>
                    <div className={"grid grid-cols-8"}>
                        <div><h3 className={"text-large font-black mb-4"}>My NFTs</h3></div>
                        <div className={"col-span-7 border-b-2 -ml-4 mr-16 mb-9"}> </div>
                    </div>
                    <div className={"grid grid-cols-5 gap-4"}>
                        {accountNfts && accountNfts.created.map((data: INFTData, index) => {
                            return <TenderCard nftData={data} tender={tenders[data.id.toNumber() - 1]} key={index}/>
                        })}
                    </div>
                    <div>
                        {accountNfts && accountNfts.owned.map((data: INFTData, index) => {
                            return <TenderCard nftData={data} tender={tenders[data.id.toNumber() - 1]} key={index}/>
                        })}
                    </div>
                </div>
            </div>
            <ModifyAccountModal isOpen={isOpen} setIsOpen={setIsOpen} accountData={accountData} setAccountData={setAccountData}/>
        </div>
    );
}
