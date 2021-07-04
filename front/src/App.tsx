import React, {useState} from 'react';
import {Header, Footer} from './components';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

import {Link, Route, NftAuction, NftHomepage, ConnectModal} from "./components";
import {TastefulData, TastefulDataProvider} from "./context";
import Home from "./components/Home";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);
    const [tastefulData, setTastefulData]: [tastefulData: any, setTastefulData: Function] = useState({});

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <TastefulDataProvider value={tastefulData}>
                <div className="App">
                    <Header setOpen={setOpen} setTenders={setTastefulData}/>
                    <Route path={'/'}>
                        <Home/>
                    </Route>
                    <Route path={'/bids'}>
                        <h1>bids</h1>
                    </Route>
                    <Route path={'/mint'}>
                        <h1>mint</h1>
                    </Route>
                    <Route path={'/NftHomepage'}>
                      <NftHomepage/>
                    </Route>
                    <Route path={'/NftAuction'}>
                        <NftAuction/>
                    </Route>
                    <ConnectModal open={open} setOpen={setOpen}/>
                    <Link className={''} href={'/NftHomepage'}>
                      LOREM
                    </Link>
                    <Footer/>
                </div>
            </TastefulDataProvider>
        </Web3ReactProvider>
    );

}

export default App;
