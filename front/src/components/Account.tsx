import React, {useContext} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {INFTData} from "../contractHelper";
import {ITastefulData, IUserData, TastefulData} from "../context";
import {TenderCard} from "./TenderCard";
import twitter from './../img/twitter.png';
import instagram from './../img/instagram.png';
import {ethers, providers} from "ethers";

async function updateAndSign(connector: any, tastefulContext: ITastefulData) {
    const web3Provider = new providers.Web3Provider(await connector.getProvider());
    const signer = web3Provider.getSigner();
    const signature = await signer.signMessage(JSON.stringify(tastefulContext.userData));

    fetch(`http://localhost:4000/user/update/${tastefulContext.userData.address}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userData: tastefulContext.userData,
            signature: signature
        })
    }).then((res) => {
        return res.json().then((res) => {
            tastefulContext.userData = res;
            tastefulContext.setTastefulData({
                ...tastefulContext
            });
        });
    });
}

export function Account(): JSX.Element {
    const web3Context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = web3Context;
    const tastefulContext = useContext(TastefulData);
    const {tenders, nftsData, userNfts, userData} = tastefulContext;

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
                <img className={"m-auto border-nft-card"} src={"https://via.placeholder.com/250"} alt={"img"}/>
                <h3 className={"text-medium font-black break-words my-8"}>{userData.pseudo !== undefined ? userData.pseudo : account}</h3>
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
                <button onClick={e => updateAndSign(connector, tastefulContext)}>Update profile</button>
            </div>
            <div className={"col-span-2"}>
                <div className={"w-two_third mb-8"}>
                    <h3 className={"text-large font-black mb-4"}>BIO</h3>
                    <p>{userData.bio}</p>
                </div>
                <div>
                    <div className={"grid grid-cols-8"}>
                        <div><h3 className={"text-large font-black mb-4"}>My NFTs</h3></div>
                        <div className={"col-span-7 border-b-2 -ml-4 mr-16 mb-9"}></div>
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
        </div>
    );
}
