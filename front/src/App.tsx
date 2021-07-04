import React, {useState} from 'react';
import {Header, Footer} from './components';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Link, Route, NftAuction, NftHomepage, ConnectModal} from "./components";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <div className="App">
                <Header setOpen={setOpen}/>
                <Route path={'/test'}>
                    <h1>TEST</h1>
                </Route>
                <Route path={'/test2'}>
                    <h1>TEST2</h1>
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
        </Web3ReactProvider>
    );

}

export default App;
