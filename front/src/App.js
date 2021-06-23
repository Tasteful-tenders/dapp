import './App.css';
import React, { Component } from 'react';

import { Header, Footer, Caroussel, NftHomepage } from './components';

class App extends Component {

  render(){
    return (
      <div className="App h-screen">
        <Header />
        <NftHomepage />
        {/* <Caroussel /> */}
        <Footer />
      </div>
    );
  }

}

export default App;
