import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import nft_example from '../img/nft_example.png';

export function NftAuction(): JSX.Element{
    return(
        <div className="grid grid-cols-3 px-32 font-all h-body py-8">
            
            <div className="col-start-1 w-big_nft">
                <Link className={''} to={'/NftHomepage'}>
                    <img src={nft_example} alt="nft_example" className="shadow-xl border-nft-card"/>
                </Link>
            </div>
            <div className="col-span-2 h-full grid-rows-3 grid">

                <div className="grid grid-cols-2 flex items-start h-middle row-end-3 row-span-2">
                    <div className="col-start-1 justify-items-start grid">
                        <div className="text-big uppercase font-black">Praza do Toural</div>
                        <div className="text-medium font-light text-grey">by Saint Jacques de Compostelle</div>
                    </div>
                    <div className="col-end-3 grid justify-items-end">
                        <div className="text-big uppercase font-black">Higher bidder</div>
                        <div className="text-big font-black text-green">2150 TTK</div>
                        <div className="text-large font-light text-grey">Your currently the higher bidder</div>
                    </div>
                </div>

                <div className="grid grid-rows-3">

                </div>

                <div className="grid grid-cols-2 flex items-end h-middle pb-6">
                    <div className="col-start-1 justify-items-start grid col-span-4 w-full">
                        <div className="font-light">Wallet : 15000 TTK</div>
                        <div className="py-3 w-middle">
                            <input type="text" className="font-light focus:outline-none text-gray-700 px-3 py-1 border-color-black w-full" placeholder="bid's amount"/>
                        </div>
                        <button className="bg-black text-white px-3 py-2 focus:outline-none font-light border-button">Add new bid</button> 
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