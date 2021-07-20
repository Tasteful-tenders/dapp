import React, { Component,useEffect, useRef, useState } from 'react';
import {BigNumber} from "ethers";
import nft_example from '../img/nft_example.png';
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {ContractHelper, INFTData} from "../contractHelper";
import { Link, useParams } from 'react-router-dom';

export function Claim(): JSX.Element  {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;

    var [allBids, setAllBids]: any[] = useState();
    const { address } : {address: string} = useParams();

    useEffect(() => {   
        async function getNftData() {
            const contractHelper = ContractHelper.getInstance();

            if (active) {
                if(contractHelper == undefined) 
                    return( <div></div> );

                //setAllBids(await contractHelper.fetchAllBids(null, "0xC29499B8c7ab51ba1aD82d47e73075595328D625"));
            }
        }

        getNftData();
    }, [active]);

    console.log(allBids);

    return(
        <div className="">
            {allBids?.slice(0).reverse().map((element: any)=>{    
                element = element.toNumber();
                return (
                    <div className="">
                        OK
                    </div>
                )
            })}
        </div>
    );
}