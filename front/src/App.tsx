import React, {useState} from 'react';
import {Header, Footer} from './components';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {NftAuction, NftHomepage, ConnectModal} from "./components";
import {TastefulDataProvider} from "./context";
import Home from "./components/Home";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);
    const [tastefulData, setTastefulData]: [tastefulData: any, setTastefulData: Function] = useState({});

    return (
        <Router>
            <Web3ReactProvider getLibrary={getLibrary}>
                <TastefulDataProvider value={tastefulData}>
                    <div className="App">
                        <Header setOpen={setOpen} setTenders={setTastefulData}/>
                        <Switch>
                            <Route path={'/bids'}>
                                <h1>bids</h1>
                            </Route>
                            <Route path={'/mint'}>
                                <h1>mint</h1>
                            </Route>
                            <Route path={'/NftHomepage/:id'}>
                                <NftHomepage/>
                            </Route>
                            <Route path={'/NftAuction/:id'}>
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
