import React, {useState} from 'react';
import {Header, Footer} from './components';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {NftAuction, NftHomepage, ConnectModal} from "./components";
import {defaultTastefulData, TastefulDataProvider} from "./context";
import Home from "./components/Home";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Account} from "./components/Account";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);
    const [tastefulData, setTastefulData]: [tastefulData: any, setTastefulData: Function] = useState(defaultTastefulData);

    return (
        <Router>
            <Web3ReactProvider getLibrary={getLibrary}>
                <TastefulDataProvider value={tastefulData}>
                    <div className="App">
                        <Header setOpen={setOpen} setTastefulData={setTastefulData}/>
                        <Switch>
                            <Route path={'/bids'}>
                                <h1>bids</h1>
                            </Route>
                            <Route path={'/mint'}>
                                <h1>mint</h1>
                            </Route>
                            <Route path={'/account/:address'}>
                                <Account/>
                            </Route>
                            <Route path={'/claim'}>
                                <h1>claim</h1>
                            </Route>
                            <Route path={'/NftHomepage'}>
                                <NftHomepage/>
                            </Route>
                            <Route path={'/NftAuction'}>
                                <NftAuction/>
                            </Route>
                            <Route path={'/'}>
                                <Home/>
                            </Route>
                        </Switch>
                        <ConnectModal open={open} setOpen={setOpen}/>
                        <Footer/>
                    </div>
                </TastefulDataProvider>
            </Web3ReactProvider>
        </Router>
    );

}

export default App;
