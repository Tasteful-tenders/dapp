import React, {useEffect, Fragment, useState} from 'react';
import {Menu, Transition} from '@headlessui/react'

import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import logo from '../img/logo.png';
import profile_icon from '../img/profile_icon.png';
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper} from "../contractHelper";
import {providers} from "ethers";
import {Link} from 'react-router-dom';

export function Header({setOpen, setTastefulData}: { setOpen: Function, setTastefulData: Function }): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;

    useEffect(() => {
        async function init() {
            if (active && connector && account) {
                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                const contractHelper = ContractHelper.init(web3Provider);
                const tenderIds = await contractHelper.fetchAllNftIds();
                setTastefulData({
                    tenders: await contractHelper.fetchAllTenders(tenderIds),
                    nftsData: await contractHelper.fetchAllNftData(tenderIds),
                    setTastefulData: setTastefulData
                });
            }
        }

        init();
    }, [active, account, chainId]);

    return (
        <nav className="flex items-center justify-between flex-wrap w-full px-32 py-5 font-all">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Link to={'/'}>
                    <img src={logo} alt="logo" className=""/>
                </Link>
            </div>
            <div className="bg-white flex items-center rounded-full shadow-md border-rounded w-search_bar">
                <input type="text" placeholder="search..."
                       className="w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none border-rounded font-light"/>
                <div className="pr-6">
                    <FontAwesomeIcon icon={faSearch} className="w-icon text-grey"/>
                </div>
            </div>
            <div className="flex flex-shrink-0">
                <NavBar setOpen={setOpen}/>
                <Dropdown active={active} account={account}/>
            </div>
        </nav>
    );
}

function NavBar({setOpen}: { setOpen: Function }): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const connectBtnLabel = active && account ? account?.slice(0, 5) + '***' + account?.slice(account?.length - 5, account?.length - 1) : 'Connect wallet';

    if (active) {
        return (
            <>
                <Link className={'px-9 font-black text-title flex items-center'} to={'/bids'}>
                    BIDS
                </Link>
                <Link className={'px-9 font-black text-title flex items-center'} to={'/mint/0'}>
                    MINT
                </Link>
            </>
        );
    }
    return (
        <button
            className="bg-black text-white px-9 focus:outline-none border-rounded font-medium text-medium"
            onClick={() => setOpen(true)}
        >{connectBtnLabel}
        </button>);
}

function Dropdown({active, account}: { active: boolean, account: any }): JSX.Element {

    return (
        <div className="font-all">
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button><img src={profile_icon} alt="profile_icon" className="h-xl pl-5 "/></Menu.Button>
                {active ?
                    <Transition as={Fragment} enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                <Link to={"/account/"+account}
                                      className={'text-light group flex rounded-md items-center w-full px-2 py-2 font-large'}>Account</Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to={"/claim/"+account}
                                      className={'text-light group flex rounded-md items-center w-full px-2 py-2 font-large text-light'}>Claim</Link>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition> : <></>}
            </Menu>
        </div>
    );

}