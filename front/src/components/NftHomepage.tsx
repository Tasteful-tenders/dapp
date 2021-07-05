import React, { Component,useEffect } from 'react';

import nft_example from '../img/nft_example.png';
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper, INFTData} from "../contractHelper";
import { Link } from 'react-router-dom';

export function NftHomepage(): JSX.Element  {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    
    useEffect(() => {    
        var nft;

        async function getNftData() {
            const contractHelper = ContractHelper.getInstance();

            if (active) {
                if(contractHelper == undefined) 
                    return( <div></div> );

                //await contractHelper.getNftData(3);
            }
        }
        
        getNftData();
    }, [active]);

        //const nft = await contractHelper.getTokenURI(3).then();

    return(
        <div className="grid grid-cols-3 px-32 font-all h-body py-8">
            
            <div className="col-start-1 w-big_nft">
                <img src={nft_example} alt="nft_example" className="shadow-xl border-nft-card"/>
            </div>
            <div className="col-span-2 h-full">

                <div className="grid grid-cols-2 flex items-start h-middle">
                    <div className="col-start-1 justify-items-start grid">
                        <div className="text-big uppercase font-black">Praza do Toural</div>
                        <div className="text-medium font-light text-grey">by Saint Jacques de Compostelle</div>
                    </div>
                    <div className="col-end-3 grid justify-items-end">
                        <div className="text-big uppercase font-black">Not sold</div>
                        <Link className={'text-large font-light text-green'} to={'/NftAuction'}>
                            add new bid
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-6 flex items-end h-middle pb-6">
                    <div className="col-start-1 justify-items-start grid col-span-4">
                        <div className="text-big font-black">Description</div>
                        <div className="text-large font-light text-left">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget risus lacus. Fusce a commodo nunc. Vestibulum quis ipsum orci. Sed sit amet commodo turpis. Cras consequat urna eget nibh malesuada tincidunt. Praesent euismod elit ac nisi cursus, id scelerisque mauris varius. Integer vitae nulla id sem convallis placerat ac volutpat sem. 
                        </div>
                    </div>
                    <div className="col-end-7 grid justify-items-end col-span-2">
                        <div className="text-title uppercase font-medium">Started price</div>
                        <div className="text-big font-black">100 TTK</div>
                    </div>
                </div>

            </div>
        </div>
    );
}