import React, {useContext, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {INFTData} from "../contractHelper";
import {TastefulData} from "../context";
import {TenderCard} from "./TenderCard";
import twitter from './../img/twitter.png';
import instagram from './../img/instagram.png';
import ModifyAccountModal from "./ModifyAccountModal";

export function Account(): JSX.Element {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const tastefulContext = useContext(TastefulData);
    const {tenders, nftsData, userNfts, userData} = tastefulContext;
    let [isOpen, setIsOpen] = useState(false);

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
                <img className={"m-auto border-nft-card w-profile_pic"} src={userData.profilePic !== undefined ? userData.profilePic : "https://via.placeholder.com/250"} alt={"img"}/>
                <h3 className={"text-medium font-black break-words my-8 text-center"}>{userData.pseudo !== undefined ? userData.pseudo : account}</h3>
                <div className={"mt-32"}>
                    <a className={"block mb-4"} href={"https://twitter.com/" + userData.twitter} target={"_blank"}>
                        <img className={"h-logo inline-block mr-12"} src={twitter} alt={'logo'}/>
                        <h3 className={"inline-block text-medium"}>{userData.twitter !== undefined ? '@' + userData.twitter : 'No account'}</h3>
                    </a>
                    <a className={"block"} href={"https://instagram.com/" + userData.instagram} target={"_blank"}>
                        <img className={"h-logo inline-block mr-12 -mt-2"} src={instagram} alt={'logo'}/>
                        <h3 className={"inline-block text-medium"}>{userData.instagram !== undefined ? '@' + userData.instagram : 'No account'}</h3>
                    </a>
                </div>
                <button onClick={openModal}>Update profile</button>
            </div>
            <div className={"col-span-2"}>
                <div className={"w-two_third mb-8"}>
                    <h3 className={"text-large font-black mb-4"}>BIO</h3>
                    <p>{userData.bio ? userData.bio : 'No bio'}</p>
                </div>
                <div>
                    <div className={"grid grid-cols-8"}>
                        <div><h3 className={"text-large font-black mb-4"}>My NFTs</h3></div>
                        <div className={"col-span-7 border-b-2 -ml-4 mr-16 mb-9"}> </div>
                    </div>
                    <div className={"grid grid-cols-5 gap-4"}>
                        {userNfts && userNfts.created.map((data: INFTData, index) => {
                            return <TenderCard nftData={data} tender={tenders[data.id.toNumber() - 1]} key={index}/>
                        })}
                    </div>
                    <div>
                        {userNfts && userNfts.owned.map((data: INFTData, index) => {
                            return <TenderCard nftData={data} tender={tenders[data.id.toNumber() - 1]} key={index}/>
                        })}
                    </div>
                </div>
            </div>
            <ModifyAccountModal isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    );
}
