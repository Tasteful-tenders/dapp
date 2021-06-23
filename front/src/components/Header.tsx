import React, {useEffect} from 'react';

import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import logo from '../img/logo.png';
import profile_icon from '../img/profile_icon.png';
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper} from "../contractHelper";
import {providers} from "ethers";

export function Header({setOpen}: {setOpen: Function}) {
    const context = useWeb3React<Web3Provider>();
    const { connector, library, chainId, account, activate, deactivate, active, error } = context;
    const connectBtnLabel = active && account ? account?.slice(0, 5)+'***'+account?.slice(account?.length - 5, account?.length - 1) : 'Connect wallet';

    useEffect(() => {
        async function init() {
            if (active && connector) {
                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                ContractHelper.init(web3Provider);
            }
        }
        init();
    }, [active]);

    return (
        <nav className="flex items-center justify-between flex-wrap w-full px-32 py-5 font-all">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <a href="">
                    <img src={logo} alt="logo" className=""/>
                </a>
            </div>
            <div className="bg-white flex items-center rounded-full shadow-md border-rounded w-search_bar">
                <input type="text" placeholder="search..."
                       className="w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none border-rounded font-light"/>
                <div className="pr-6">
                    <FontAwesomeIcon icon={faSearch} className="w-icon text-grey"/>
                </div>
            </div>
            <div className="flex  flex-shrink-0">
                <button
                    className="bg-black text-white px-9 focus:outline-none border-rounded font-medium text-medium"
                    onClick={() => setOpen(true)}
                >{connectBtnLabel}
                </button>
                <img src={profile_icon} alt="profile_icon" className="h-xl pl-5"/>
            </div>
        </nav>
    );
}